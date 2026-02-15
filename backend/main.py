from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model_service import predict_risk
from services.resource_service import get_dept_availability, set_dept_availability
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AvailabilityUpdate(BaseModel):
    dept: str
    is_available: bool

@app.post("/predict")
def get_prediction(data: dict):
    result = predict_risk(data)
    return result

@app.get("/availability")
def get_availability():
    return get_dept_availability()

@app.post("/availability")
def update_availability(update: AvailabilityUpdate):
    success = set_dept_availability(update.dept, update.is_available)
    return {"success": success, "availability": get_dept_availability()}
