import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# 1. Generate Realistic Insurance Dataset
# Features: [age, income_level, smoker, dependents, health_risk]
# Target: 0 (Health), 1 (Life), 2 (Auto), 3 (Property)

def generate_realistic_data(n_samples=2000):
    np.random.seed(42)
    age = np.random.randint(18, 70, n_samples)
    income = np.random.choice([0, 1, 2], n_samples) # 0: Low, 1: Middle, 2: High
    smoker = np.random.choice([0, 1], n_samples) # 0: No, 1: Yes
    dependents = np.random.randint(0, 5, n_samples)
    health_risk = np.random.choice([0, 1], n_samples, p=[0.8, 0.2])

    data = pd.DataFrame({
        'age': age,
        'income': income,
        'smoker': smoker,
        'dependents': dependents,
        'health_risk': health_risk
    })

    # Logic-based Target generation (with some noise)
    def assign_target(row):
        # Health priority
        if row['health_risk'] == 1 or row['age'] > 50:
            return 0 # Health
        # Life priority
        if row['dependents'] > 0 and row['age'] > 25:
            return 1 # Life
        # Property priority
        if row['income'] == 2 and np.random.rand() > 0.5:
            return 3 # Property
        # Default Auto
        return 2 # Auto

    data['target'] = data.apply(assign_target, axis=1)
    return data

def train_and_save():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'insurance_data.csv')
    model_path = os.path.join(base_dir, 'model.pkl')

    print(f"🚀 Generating realistic insurance dataset at {csv_path}...")
    df = generate_realistic_data()
    df.to_csv(csv_path, index=False)

    X = df.drop('target', axis=1)
    y = df['target']

    print("🧠 Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    print(f"💾 Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("✅ Model training complete!")

if __name__ == "__main__":
    train_and_save()
