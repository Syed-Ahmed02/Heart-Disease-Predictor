from fastapi import FastAPI
from pydantic import BaseModel
from enum import Enum
from .predict import predict_heart_disease
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv
import os
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)
frontend_url = os.getenv("FRONTEND_URL")

app=FastAPI()

app.add_middleware(
     CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

class Gender(str,Enum):
    Male = "Male"
    Female = "Female"
class LowMediumHigh(str,Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"
class YesNo(str,Enum):
    Yes = "Yes"
    No = "No"
class HeartDisease(BaseModel):
    age: float
    gender: Gender
    blood_pressure: int
    cholesterol_level: int
    exercise_habits: LowMediumHigh
    smoking: YesNo
    family_heart_disease: YesNo
    diabetes: YesNo
    bmi: float
    high_blood_pressure: YesNo
    low_hdl_cholesterol: YesNo
    high_ldl_cholesterol: YesNo
    alcohol_consumption: LowMediumHigh
    stress_level: LowMediumHigh
    sleep_hours: float
    sugar_consumption: LowMediumHigh
    triglyceride_level: float
    fasting_blood_sugar: float
    crp_level: float
    homocysteine_level: float

@app.post("/classify_heart_disease")
async def classify_heart_disease(data:HeartDisease):
    result = predict_heart_disease(data.model_dump())
    if result == 1:
        result = "Yes"
    else:
        result = "No"
    return {"result": result}