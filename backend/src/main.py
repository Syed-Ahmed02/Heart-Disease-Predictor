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

class HeartDisease(BaseModel):
    cholesterol_level: int
    blood_pressure: int
    triglyceride_level: float
    fasting_blood_sugar: float
    age: float
    bmi: float
    homocysteine_level: float
    crp_level: float
    sleep_hours: float

@app.post("/classify_heart_disease")
async def classify_heart_disease(data:HeartDisease):
    result, prediction = predict_heart_disease(data.model_dump())
    if prediction == 1:
        result = "Yes"
    else:
        result = "No"
    return {"result": result}