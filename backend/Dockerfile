FROM python:3.11.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./data/heart_disease.csv /code/heart_disease.csv

COPY ./models/logistic_regression_model.pkl /code/logistic_regression_model.pkl

COPY ./models/scaler.pkl /code/scaler.pkl

COPY ./src /code/src

COPY ./.env /code/.env

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]