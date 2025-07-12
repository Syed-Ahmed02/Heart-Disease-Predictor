import numpy as np
import pandas as pd
import os
import tensorflow as tf
# pyright: reportAttributeAccessIssue=false
model = tf.keras.models.load_model(os.path.join(os.getcwd(), "models/neural_network.keras"))

def encode_data(data:pd.DataFrame):
    categroical_values = []
    for colum in data.columns:
        if not(pd.api.types.is_numeric_dtype(data[colum])):
            categroical_values.append(colum)
    encoded_df = data.copy()
    encoded_df=encoded_df.dropna()

    mapping = {'Low': 0, 'Medium': 1, 'High': 2}
#     {
#   "age": 28,
#   "gender": "Male",
#   "blood_pressure": 180,
#   "cholesterol_level": 296,
#   "exercise_habits": "Medium",
#   "smoking": "No",
#   "family_heart_disease": "Yes",
#   "diabetes": "No",
#   "bmi": 29,
#   "high_blood_pressure": "Yes",
#   "low_hdl_cholesterol": "Yes",
#   "high_ldl_cholesterol": "No",
#   "alcohol_consumption": "Medium",
#   "stress_level": "High",
#   "sleep_hours": 9,
#   "sugar_consumption": "Medium",
#   "triglyceride_level": 309,
#   "fasting_blood_sugar": 147,
#   "crp_level": 2,
#   "homocysteine_level": 6
# }
    encoded_df["sugar_consumption"] = encoded_df['sugar_consumption'].replace(mapping)
    encoded_df["exercise_habits"] = encoded_df['exercise_habits'].replace(mapping)
    encoded_df["stress_level"] = encoded_df["stress_level"].replace(mapping)
    encoded_df["alcohol_consumption"] = encoded_df["alcohol_consumption"].replace(mapping)


    encoded_df["gender"] = (encoded_df['gender']=="Male").astype(int)
    encoded_df["smoking"] = (encoded_df['smoking'] == 'Yes').astype(int)
    encoded_df["family_heart_disease"] = (encoded_df["family_heart_disease"] == 'Yes').astype(int)
    encoded_df["diabetes"] = (encoded_df["diabetes"]=="Yes").astype(int)
    encoded_df["high_blood_pressure"] = (encoded_df["high_blood_pressure"]=="Yes").astype(int)
    encoded_df["low_hdl_cholesterol"] = (encoded_df["low_hdl_cholesterol"]=="Yes").astype(int)
    encoded_df["high_ldl_cholesterol"] = (encoded_df["high_ldl_cholesterol"]=="Yes").astype(int)

    return encoded_df


def predict_heart_disease(data:dict):
    data_pd = pd.DataFrame([data])

    encoded_data = encode_data(data_pd)
    threshold = 0.5
    yhat = model.predict(encoded_data)
    yhat = yhat.flatten()
    yhat = np.where(yhat >= threshold, 1, 0)

    return yhat[0]