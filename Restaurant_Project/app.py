from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings('ignore')


app = Flask(__name__)
CORS(app) # enable cors foe react and nodejs calls


# ===== SALES FORECAST ENDPOINT =====
@app.route("/api/predict/sales", methods=['POST'])
def predict_sales():
    """
    Receives: sales_values (list), days_to_predict (int)
    Returns: forecast for next N days using ARIMA
    """
    try:
        data = request.get_json()
        sales_values = data.get('sales_values', [])
        days = data.get('days_to_predict', 7)
        
        if len(sales_values) < 5:
            # Fallback to simple average if not enough data
            avg = np.mean(sales_values) if sales_values else 1000
            forecast = [avg * (1 + i * 0.02) for i in range(days)]  # 2% growth
        else:
            # Check if there is zero variance (e.g. all 0s or all same number)
            # ARIMA will crash with a LinAlgError if the data is perfectly flat
            if np.std(sales_values) == 0:
                val = sales_values[0] if sales_values else 0
                forecast = [val] * days
            else:
                # Convert to pandas Series
                series = pd.Series(sales_values)
                
                # ARIMA model (5,1,0) - good for sales forecasting
                model = ARIMA(series, order=(5, 1, 0))
                model_fit = model.fit()
                
                # Generate forecast
                forecast = model_fit.forecast(steps=days).tolist()
        
        return jsonify({
            "status": "success",
            "forecast": [round(x, 2) for x in forecast],
            "days_predicted": days
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    



# ===== BUSY HOURS PREDICTION ENDPOINT =====
@app.route("/api/predict/busy-hours", methods=['POST'])
def predict_busy_hours():
    """
    Receives: traffic_by_hour (object with hour: [counts])
    Returns: predicted busy hours with peak times
    """
    try:
        data = request.get_json()
        traffic_by_hour = data.get('traffic_by_hour', {})
        
        if not traffic_by_hour:
            # Mock data if none provided
            return jsonify({
                "status": "success",
                "hourly_forecast": {12: 80, 13: 90, 18: 100, 19: 95, 20: 85},
                "peak_hours": [
                    {"hour": 18, "expected_traffic": 100},
                    {"hour": 19, "expected_traffic": 95},
                    {"hour": 13, "expected_traffic": 90}
                ]
            })
        
        # Calculate average traffic per hour
        hourly_avg = {}
        for hour, counts in traffic_by_hour.items():
            if counts and len(counts) > 0:
                hourly_avg[int(hour)] = np.mean(counts)
        
        # Predict 5% growth for next period
        hourly_forecast = {}
        for hour, avg in hourly_avg.items():
            hourly_forecast[hour] = round(avg * 1.05)
        
        # Find top 3 peak hours
        peak_hours = sorted(hourly_forecast.items(), key=lambda x: x[1], reverse=True)[:3]
        peak_hours_formatted = [{"hour": h, "expected_traffic": v} for h, v in peak_hours]
        
        return jsonify({
            "status": "success",
            "historical_avg": {h: round(v) for h, v in hourly_avg.items()},
            "hourly_forecast": hourly_forecast,
            "peak_hours": peak_hours_formatted
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500




# ===== GLOBAL INSIGHTS ENDPOINT =====
@app.route("/api/predict/insights", methods=['POST'])
def generate_insights():
    """
    Receives: historical_sales, sales_forecast, historical_traffic, peak_hours
    Returns: actionable structured JSON insights based on predictions
    """
    try:
        data = request.get_json()
        historical_sales = data.get('historical_sales', [])
        forecast = data.get('sales_forecast', [])
        historical_traffic = data.get('historical_traffic', {})
        peak_hours = data.get('peak_hours', [])
        
        insights = []
        
        # 1. Revenue Insight
        if forecast:
            avg_forecast = np.mean(forecast)
            avg_hist = np.mean(historical_sales) if historical_sales else avg_forecast
            
            # Calculate % difference
            diff_pct = ((avg_forecast - avg_hist) / avg_hist * 100) if avg_hist > 0 else 0
            
            if diff_pct > 15:
                insights.append({
                    "type": "revenue",
                    "severity": "positive",
                    "title": "Revenue Surge Expected",
                    "description": f"Predicted average daily revenue is ${avg_forecast:.0f}, which is {diff_pct:.0f}% higher than your recent historical average.",
                    "action": "Ensure high-margin items are fully stocked.",
                    "trend": f"▲ +{diff_pct:.0f}% vs Avg"
                })
            elif diff_pct < -15:
                insights.append({
                    "type": "revenue",
                    "severity": "negative",
                    "title": "Revenue Drop Predicted",
                    "description": f"Predicted average daily revenue is dropping to ${avg_forecast:.0f} (a {abs(diff_pct):.0f}% decrease).",
                    "action": "Consider running a targeted promotion.",
                    "trend": f"▼ {diff_pct:.0f}% vs Avg"
                })
            else:
                insights.append({
                    "type": "revenue",
                    "severity": "neutral",
                    "title": "Stable Revenue Forecast",
                    "description": f"Revenue is expected to remain steady at an average of ${avg_forecast:.0f} per day.",
                    "action": "Maintain current operational levels.",
                    "trend": "▶ Stable"
                })
        
        # 2. Traffic/Staffing Insight
        if peak_hours and len(peak_hours) > 0:
            top_peak = peak_hours[0]
            peak_h = top_peak['hour']
            expected = top_peak['expected_traffic']
            hist_avg = historical_traffic.get(str(peak_h), expected)
            
            diff_pct = ((expected - hist_avg) / hist_avg * 100) if hist_avg > 0 else 0
            
            if diff_pct > 20:
                insights.append({
                    "type": "staffing",
                    "severity": "warning",
                    "title": "Unusual Traffic Spike",
                    "description": f"Prepare for a massive rush at {peak_h}:00. Expected traffic ({expected}) is {diff_pct:.0f}% higher than normal.",
                    "action": "Call in extra servers for this shift.",
                    "trend": f"▲ +{diff_pct:.0f}% Spike"
                })
            else:
                insights.append({
                    "type": "traffic",
                    "severity": "neutral",
                    "title": "Daily Peak Hours",
                    "description": f"Your busiest time today will be around {peak_h}:00 with approximately {expected} expected customers.",
                    "action": "Ensure all stations are prepped by this time.",
                    "trend": f"Peak: {peak_h}:00"
                })
        
        # 3. Inventory/Stock Insight
        if forecast:
            max_forecast_day = max(forecast)
            insights.append({
                "type": "inventory",
                "severity": "neutral",
                "title": "Stock Optimization",
                "description": f"Your highest revenue day this week is projected to hit ${max_forecast_day:.0f}.",
                "action": "Review inventory for top-selling items.",
                "trend": "Action Required"
            })
        
        return jsonify({
            "status": "success",
            "insights": insights,
            "average_forecast": round(np.mean(forecast), 2) if forecast else 0,
            "trend": "📈 Upward" if forecast and len(forecast) > 1 and forecast[-1] > forecast[0] else "📉 Downward"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# Health check endpoint
@app.route("/health", methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "ML Predictions"})

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=False, port=port, host='0.0.0.0')