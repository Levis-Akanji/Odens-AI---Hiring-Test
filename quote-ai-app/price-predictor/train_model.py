import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

# Load historical data
df = pd.read_csv('historical_quotes.csv')

# Separate features and target
X = df[['ProfileType', 'Alloy', 'Weight_per_meter', 'Total_length', 'SurfaceTreatment', 'MachiningComplexity']]
y = df['FinalPrice']

# One-hot encode categorical features
X_encoded = pd.get_dummies(X)

# Save column names for prediction-time matching
joblib.dump(X_encoded.columns.tolist(), 'model_columns.pkl')  # ✅ Save columns

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2)
model = GradientBoostingRegressor()
model.fit(X_train, y_train)

# Evaluate (optional)
preds = model.predict(X_test)
mse = mean_squared_error(y_test, preds)
print(f"✅ Model trained. MSE: {mse}")

# Save model
joblib.dump(model, 'model.pkl')
