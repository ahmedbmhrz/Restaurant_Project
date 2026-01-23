from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    # Fake prediction for now
    return jsonify({"prediction": "You will need 50 Burgers tomorrow"})

if __name__ == '__main__':
    app.run(port=5001)