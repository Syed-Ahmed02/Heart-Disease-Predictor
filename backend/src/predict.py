import numpy as np
import pandas as pd
import os
import joblib

# Load the Logistic Regression model and scaler
model = joblib.load(os.path.join(os.getcwd(), "models/logistic_regression_model.pkl"))
scaler = joblib.load(os.path.join(os.getcwd(), "models/scaler.pkl"))

def encode_data(data: pd.DataFrame):
    categroical_values = []
    for colum in data.columns:
        if not(pd.api.types.is_numeric_dtype(data[colum])):
            categroical_values.append(colum)
    
    encoded_df = data.copy()
    encoded_df = encoded_df.dropna()

    encoded_df = pd.get_dummies(encoded_df, prefix=categroical_values[:-1], columns=categroical_values[:-1])
    
    expected_columns = [
        'Age', 'Blood Pressure', 'Cholesterol Level', 'BMI', 'Sleep Hours',
        'Triglyceride Level', 'Fasting Blood Sugar', 'CRP Level', 'Homocysteine Level',
        'Gender_Female', 'Gender_Male', 'Exercise Habits_High', 'Exercise Habits_Low', 
        'Exercise Habits_Medium', 'Smoking_No', 'Smoking_Yes', 'Family Heart Disease_No',
        'Family Heart Disease_Yes', 'Diabetes_No', 'Diabetes_Yes', 'High Blood Pressure_No',
        'High Blood Pressure_Yes', 'Low HDL Cholesterol_No', 'Low HDL Cholesterol_Yes',
        'High LDL Cholesterol_No', 'High LDL Cholesterol_Yes', 'Alcohol Consumption_High',
        'Alcohol Consumption_Low', 'Alcohol Consumption_Medium', 'Stress Level_High',
        'Stress Level_Low', 'Stress Level_Medium', 'Sugar Consumption_High',
        'Sugar Consumption_Low', 'Sugar Consumption_Medium'
    ]
    
    for col in expected_columns:
        if col not in encoded_df.columns:
            encoded_df[col] = 0
    
    # Ensure correct column order
    encoded_df = encoded_df.reindex(columns=expected_columns)
    
    return encoded_df

def predict_heart_disease(data: dict):
    data_pd = pd.DataFrame([data])
    
    # Encode the data
    encoded_data = encode_data(data_pd)
    
    # Scale the features using the fitted scaler
    scaled_data = scaler.transform(encoded_data)
    
    probability = model.predict_proba(scaled_data)
    #prediction
    prediction = model.predict(scaled_data)
    
    return probability[0][1], prediction[0]