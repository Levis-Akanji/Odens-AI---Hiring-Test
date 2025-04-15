# price-predictor/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load model and column structure
model = joblib.load('model.pkl')
model_columns = joblib.load('model_columns.pkl')  # Loaded column names

@app.route('/')
def home():
    return 'Price Predictor API running.'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("📥 Received data:", data)

        # Convert input to DataFrame
        df = pd.DataFrame([data])

        # One-hot encode input
        df_encoded = pd.get_dummies(df)

        # Reindex to match training columns
        df_encoded = df_encoded.reindex(columns=model_columns, fill_value=0)

        print("📊 Processed input:\n", df_encoded)

        # Predict
        prediction = model.predict(df_encoded)
        print("✅ Prediction result:", prediction)

        return jsonify({'predicted_price': round(prediction[0], 2)})

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
