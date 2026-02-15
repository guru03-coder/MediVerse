import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import classification_report
import joblib
import os

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "patient_data.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Check if dataset exists
if not os.path.exists(DATA_PATH):
    print("Error: patient_data.csv not found!")
    print("Creating synthetic data for retraining...")
    
    # Create improved synthetic data
    n_samples = 1000
    dummy_data = {
        "Age": np.random.randint(5, 95, n_samples),
        "Blood Pressure": [f"{np.random.randint(90, 180)}/{np.random.randint(60, 110)}" for _ in range(n_samples)],
        "Heart Rate": np.random.randint(50, 140, n_samples),
        "Temperature": np.random.uniform(96.0, 105.0, n_samples),
        "Gender": np.random.choice(["Male", "Female"], n_samples),
        "Symptoms": np.random.choice([
            "Chest Pain", "Severe Breathlessness", "Fever and Confusion", "Fracture", 
            "Headache", "Abdominal Pain", "Dizziness", "Cough", "Rash"
        ], n_samples)
    }
    df = pd.DataFrame(dummy_data)
    
    # Logic for synthetic labels (Risk, Dept, Advice)
    def assign_labels(row):
        symptoms = row['Symptoms'].lower()
        age = row['Age']
        
        # Cardiology
        if 'chest' in symptoms or 'breath' in symptoms or row['Heart Rate'] > 120:
            return pd.Series(['High', 'Cardiology', 'Sit down, rest, take aspirin if available'])
            
        # Neurology
        if 'confusion' in symptoms or 'headache' in symptoms or 'dizzi' in symptoms:
            return pd.Series(['High' if 'confusion' in symptoms else 'Medium', 'Neurology', 'Lie down, avoid bright lights'])
            
        # Orthopedics
        if 'fracture' in symptoms or 'bone' in symptoms:
            return pd.Series(['Medium', 'Orthopedics', 'Immobilize the area, apply ice'])
            
        # Pediatrics
        if age < 18:
            return pd.Series(['Low' if row['Temperature'] < 100 else 'Medium', 'Pediatrics', 'Keep warm, monitor hydration'])
            
        # General
        return pd.Series(['Low', 'General', 'Rest, drink plenty of water'])

    df[['Risk_Level', 'Recommended_Dept', 'Safety_Advice']] = df.apply(assign_labels, axis=1)
    
    df.to_csv(DATA_PATH, index=False)
    print(f"Created enhanced {DATA_PATH}")
else:
    # Load dataset
    df = pd.read_csv(DATA_PATH)
    if "Symptom" in df.columns:
        df.rename(columns={"Symptom": "Symptoms"}, inplace=True)

# Drop unrealistic ages
df = df[df["Age"] > 0]

# Split Blood Pressure
df[["Systolic_BP", "Diastolic_BP"]] = df["Blood Pressure"].str.split("/", expand=True)
df["Systolic_BP"] = df["Systolic_BP"].astype(int)
df["Diastolic_BP"] = df["Diastolic_BP"].astype(int)

df.drop(columns=["Blood Pressure"], inplace=True)

# --- Feature Engineering ---
# Add medical intelligence
df["Is_Hypertensive"] = (df["Systolic_BP"] > 140).astype(int)
df["Is_Tachycardic"] = (df["Heart Rate"] > 100).astype(int)
df["Has_Fever"] = (df["Temperature"] > 100).astype(int)

# Age Groups: 0-18 (Child), 19-60 (Adult), 60+ (Senior)
df["Age_Group"] = pd.cut(df["Age"], bins=[0,18,60,100], labels=[0,1,2]).astype(int)

# Encode Gender
df["Gender"] = LabelEncoder().fit_transform(df["Gender"])

# --- Symptom Encoding ---
# Create symptom flags manually
df["Chest_Pain"] = df["Symptoms"].str.contains("chest pain", case=False).astype(int)
df["Breathlessness"] = df["Symptoms"].str.contains("breath", case=False).astype(int)
df["Confusion"] = df["Symptoms"].str.contains("confusion", case=False).astype(int)
df["Fever_Symptom"] = df["Symptoms"].str.contains("fever", case=False).astype(int)

# Drop raw text column
df.drop(columns=["Symptoms"], inplace=True)

# --- Target Encoding & Training ---

def train_and_save(target_col, model_name, encoder_name):
    print(f"\nTraining {model_name}...")
    le = LabelEncoder()
    y = le.fit_transform(df[target_col])
    
    # Save encoder
    joblib.dump(le, os.path.join(MODELS_DIR, encoder_name))
    print(f"Saved {encoder_name}")
    
    # Train
    drop_cols = ["Risk_Level", "Recommended_Dept", "Safety_Advice"]
    if "Patient_ID" in df.columns:
        drop_cols.append("Patient_ID")
        
    X = df.drop(columns=[c for c in drop_cols if c in df.columns])
    
    # Save feature names once
    if target_col == "Risk_Level":
        joblib.dump(list(X.columns), os.path.join(MODELS_DIR, "feature_names.pkl"))

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    print(classification_report(y_test, preds))
    
    joblib.dump(model, os.path.join(MODELS_DIR, model_name))
    print(f"Saved {model_name}")

# Train all three models
train_and_save("Risk_Level", "risk_model.pkl", "label_encoder.pkl")
train_and_save("Recommended_Dept", "dept_model.pkl", "dept_encoder.pkl")
train_and_save("Safety_Advice", "advice_model.pkl", "advice_encoder.pkl")

print("\nAll models trained and saved!")
