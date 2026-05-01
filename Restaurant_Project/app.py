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
    Receives: sales_forecast (list), peak_hours (list)
    Returns: actionable insights based on predictions
    """
    try:
        data = request.get_json()
        forecast = data.get('sales_forecast', [])
        peak_hours = data.get('peak_hours', [])
        
        insights = []
        
        # Revenue insights
        if forecast:
            avg_forecast = np.mean(forecast)
            trend = "📈 Upward" if len(forecast) > 1 and forecast[-1] > forecast[0] else "📉 Downward"
            
            if avg_forecast > 5000:
                insights.append("💰 Strong revenue expected - consider extended shifts")
            elif avg_forecast < 2000:
                insights.append("⚠️ Low forecast - optimize staffing and inventory")
            else:
                insights.append("📊 Moderate revenue expected - maintain current operations")
            
            insights.append(f"📈 Trend: {trend} (Avg: ${avg_forecast:.0f})")
        
        # Traffic insights
        if peak_hours and len(peak_hours) > 0:
            top_peak = peak_hours[0]
            insights.append(f"📊 Prepare for peak traffic at {top_peak['hour']}:00 ({top_peak['expected_traffic']} expected)")
            
            if len(peak_hours) > 1:
                insights.append(f"🎯 Secondary peak at {peak_hours[1]['hour']}:00")
        
        # General recommendations
        insights.append("🔄 Monitor real-time data and adjust staffing accordingly")
        
        return jsonify({
            "status": "success",
            "insights": insights,
            "average_forecast": round(np.mean(forecast), 2) if forecast else 0,
            "trend": trend if 'trend' in locals() else "📊 Stable"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# Health check endpoint
@app.route("/health", methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "ML Predictions"})

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')