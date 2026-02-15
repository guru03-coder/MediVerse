import joblib
import pandas as pd
import os
from services.nlp_service import extract_symptoms


# Resolve paths relative to this file's directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load all models and encoders
risk_model = joblib.load(os.path.join(BASE_DIR, "models/risk_model.pkl"))
risk_encoder = joblib.load(os.path.join(BASE_DIR, "models/label_encoder.pkl"))

dept_model = joblib.load(os.path.join(BASE_DIR, "models/dept_model.pkl"))
dept_encoder = joblib.load(os.path.join(BASE_DIR, "models/dept_encoder.pkl"))

advice_model = joblib.load(os.path.join(BASE_DIR, "models/advice_model.pkl"))
advice_encoder = joblib.load(os.path.join(BASE_DIR, "models/advice_encoder.pkl"))

feature_names = joblib.load(os.path.join(BASE_DIR, "models/feature_names.pkl"))

def predict_risk(input_data: dict):
    """
    Predict risk level, department, and safety advice.
    """

    df = pd.DataFrame([input_data])
    
    # Ensure types
    if "Age" in df.columns:
        df["Age"] = pd.to_numeric(df["Age"], errors='coerce').fillna(0).astype(int)
    if "Heart Rate" in df.columns:
        df["Heart Rate"] = pd.to_numeric(df["Heart Rate"], errors='coerce').fillna(0).astype(int)
    if "Temperature" in df.columns:
        df["Temperature"] = pd.to_numeric(df["Temperature"], errors='coerce').fillna(0.0).astype(float)


    # --- Preprocessing (Must match training) ---
    df[["Systolic_BP", "Diastolic_BP"]] = df["Blood Pressure"].str.split("/", expand=True)
    df["Systolic_BP"] = df["Systolic_BP"].astype(int)
    df["Diastolic_BP"] = df["Diastolic_BP"].astype(int)

    df["Is_Hypertensive"] = (df["Systolic_BP"] > 140).astype(int)
    df["Is_Tachycardic"] = (df["Heart Rate"] > 100).astype(int)
    df["Has_Fever"] = (df["Temperature"] > 100).astype(int)

    df["Age_Group"] = pd.cut(df["Age"], bins=[0,18,60,100], labels=[0,1,2]).astype(int)
    df["Gender"] = df["Gender"].map({"Female": 0, "Male": 1}).astype(int)

    symptoms_list = extract_symptoms(input_data["Symptoms"])
    df["Chest_Pain"] = int("chest pain" in symptoms_list)
    df["Breathlessness"] = int("breathlessness" in symptoms_list)
    df["Confusion"] = int("confusion" in symptoms_list)
    df["Fever_Symptom"] = int("fever" in symptoms_list)

    df.drop(columns=["Blood Pressure", "Symptoms"], inplace=True)
    df = df[feature_names]

    # --- Predictions ---
    # 1. Risk Level
    risk_pred = risk_model.predict(df)
    risk_level = risk_encoder.inverse_transform(risk_pred)[0]
    
    # Confidence
    confidence = 0.0
    if hasattr(risk_model, 'predict_proba'):
        confidence = float(risk_model.predict_proba(df).max())

    # 2. Safety Advice
    advice_pred = advice_model.predict(df)
    advice = advice_encoder.inverse_transform(advice_pred)[0]

    # 3. Department Recommendation & Availability
    dept_pred = dept_model.predict(df)
    recommended_dept = dept_encoder.inverse_transform(dept_pred)[0]
    
    return {
        "risk_level": risk_level,
        "confidence": confidence,
        "recommended_dept": recommended_dept,
        "safety_advice": advice
    }


# Quick test
if __name__ == "__main__":
    test_patient = {
        "Age": 65,
        "Blood Pressure": "150/95",
        "Heart Rate": 110,
        "Temperature": 101.2,
        "Gender": "Male",
        "Symptoms": "Chest Pain and Breathlessness"
    }

    result = predict_risk(test_patient)
    print(f"Result: {result}")
