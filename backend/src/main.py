from fastapi import FastAPI
from pydantic import BaseModel
from enum import Enum
from .predict import predict_heart_disease

app=FastAPI()

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
    age: int
    gender: Gender
    blood_pressure: int
    cholesterol_level: int
    exercise_habits: LowMediumHigh
    smoking: YesNo
    family_heart_disease: YesNo
    diabetes: YesNo
    bmi: int
    high_blood_pressure: YesNo
    low_hdl_cholesterol: YesNo
    high_ldl_cholesterol: YesNo
    alcohol_consumption: LowMediumHigh
    stress_level: LowMediumHigh
    sleep_hours: int
    sugar_consumption: LowMediumHigh
    triglyceride_level: int
    fasting_blood_sugar: int
    crp_level: int
    homocysteine_level: int

@app.post("/classify_heart_disease")
async def classify_heart_disease(data:HeartDisease):
    result = predict_heart_disease(data.model_dump())
    if result == 1:
        result = "Yes"
    else:
        result = "No"
    return {"result": result}