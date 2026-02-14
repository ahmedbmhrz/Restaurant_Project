from flask import Flask,render_template, jsonify, request
import pandas as pd
import numpy as np


app = Flask(__name__)


@app.route("/")

def predict():
    return render_template("ai.html")



# TODO: THE CODE IS NOT COMPLETE WATING FOR THE DATABASE TABLES AND COLUMNS

'''
# --- MOCK DATA LOADER (Replace this with DB connection later) ---
def get_historical_data():
    # In the future: query = "SELECT date, sales FROM sales_table"
    # df = pd.read_sql(query, db_connection)
    dates = pd.date_range(start='2023-01-01', periods=100)
    sales = np.random.randint(1000, 5000, size=100)
    return pd.DataFrame({'date': dates, 'sales': sales})

# --- ML MODEL PLACEHOLDER ---
def run_forecast_model(data, days_to_predict):
    # TODO: Implement ARIMA or LSTM here
    # model = ARIMA(data['sales'], order=(5,1,0))
    # model_fit = model.fit()
    # forecast = model_fit.forecast(steps=days_to_predict)
    
    # Mocking a return for now
    mock_forecast = [val * 1.05 for val in data['sales'].tail(days_to_predict).tolist()]
    return mock_forecast

@app.route("/")
def home():
    # Redirects to AI page for now
    return render_template("ai.html")

@app.route("/api/predict", methods=['POST'])
def predict_api():
    """
    This endpoint will be called by the frontend or the Node.js backend
    """
    req_data = request.get_json()
    target = req_data.get('target', 'all')
    days = int(req_data.get('timeframe', 7))

    # 1. Fetch Data
    df = get_historical_data()
    
    # 2. Process & Predict
    prediction_values = run_forecast_model(df, days)
    
    # 3. Return JSON response
    return jsonify({
        "status": "success",
        "target": target,
        "prediction": prediction_values,
        "alert": "Inventory low on item X"
    })

'''

#for running the page
if __name__ == "__main__":
    app.run(debug=True)