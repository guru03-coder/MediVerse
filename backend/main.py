from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Services
from model_service import predict_risk
from services.doctor_service import add_doctor, toggle_doctor_activation, get_doctors_by_department
from services.queue_service import get_department_stats, get_overall_queue_stats
from services.patient_service import admit_patient, get_waiting_patients, discharge_patient
from services.ai_service import generate_medical_insight
from database import init_db

app = FastAPI()

# Init DB on startup
init_db()

# Allow frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class DoctorCreate(BaseModel):
    name: str
    department_id: str

class DoctorToggle(BaseModel):
    doctor_id: str
    is_active: bool

class PredictRequest(BaseModel):
    # Flexible dict to handle full patient object
    # We'll parse it inside
    Age: int
    Gender: str
    Symptoms: str
    Vitals: dict # Expected {BP, HR, Temp} or similar

# --- Endpoints ---

@app.post("/predict")
def triage_patient(data: dict):
    # 1. ML Prediction
    # We use model_service just for the raw ML output now
    # We need to extract the parts manually if we want to use 'admit_patient' logic separate
    # OR we update predict_risk to return the components we need.
    
    # Let's peek at model_service.py again. 
    # It currently does logic + return dict.
    # We should let model_service do the PURE ML, and let main/patient_service do the LOGIC.
    
    # Calling the existing ML function
    # Note: We need to adapt the input to match what predict_risk expects (flat dict usually)
    # The frontend sends a nested dict sometimes.
    # Let's flatten if needed or pass as is if valid.
    
    ml_result = predict_risk(data) 
    
    # 2. Workflow Logic (Admit & Route)
    admission = admit_patient(
        patient_data=data,
        risk_level=ml_result["risk_level"],
        recommended_dept=ml_result["recommended_dept"]
    )
    
    # Merge results
    return {
        **ml_result,
        "assigned_dept": admission["assigned_dept"], # Dynamic Override
        "patient_id": admission["id"],
        "priority_weight": admission["priority"]
    }

@app.get("/dashboard/stats")
def get_dashboard_metrics():
    dept_stats = get_department_stats()
    queue_stats = get_overall_queue_stats()
    return {
        "departments": dept_stats,
        "queue": queue_stats
    }

@app.get("/patients")
def get_live_queue():
    return get_waiting_patients()

@app.get("/dashboard/analytics")
def get_analytics():
    from services.queue_service import get_analytics_data
    return get_analytics_data()

@app.post("/patients/{patient_id}/discharge")
def discharge(patient_id: str):
    success = discharge_patient(patient_id)
    return {"success": success}

@app.post("/patients/analyze")
def analyze_patient(data: dict):
    # Expects full patient data or similar to predict
    insight = generate_medical_insight(data)
    return {"insight": insight}

# --- Doctor Management ---

@app.post("/doctor/add")
def create_doctor(doc: DoctorCreate):
    return add_doctor(doc.name, doc.department_id)

@app.post("/doctor/toggle")
def toggle_doctor(doc: DoctorToggle):
    success = toggle_doctor_activation(doc.doctor_id, doc.is_active)
@app.get("/doctors")
def get_doctors(department_id: Optional[str] = None):
    if department_id:
        return get_doctors_by_department(department_id)
    return []


# Helper to get dept IDs for frontend to call /doctor/add
@app.get("/departments")
def list_departments():
    # Only if needed, we can query DB
    from database import get_db_connection
    conn = get_db_connection()
    depts = conn.execute("SELECT * FROM departments").fetchall()
    conn.close()
    return [dict(d) for d in depts]
