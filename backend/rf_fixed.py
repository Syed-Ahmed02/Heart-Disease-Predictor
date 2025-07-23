import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, precision_score, recall_score, accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Load and preprocess data (assuming you have the same preprocessing steps)
df = pd.read_csv('data/heart_disease.csv')
df = df.dropna()

# Encode categorical variables
categorical_values = []
for column in df.columns:
    if not pd.api.types.is_numeric_dtype(df[column]):
        categorical_values.append(column)

encoded_df = df.copy()
encoded_df["Heart Disease Status"] = (df["Heart Disease Status"]=="Yes").astype(int)
encoded_df = pd.get_dummies(data=encoded_df, prefix=categorical_values[:-1], columns=categorical_values[:-1])
encoded_df = encoded_df.astype(int)

# Prepare features and target
features = encoded_df.columns
X = encoded_df[features.drop("Heart Disease Status")]
y = encoded_df["Heart Disease Status"].copy()

# Split data
X_train, x_, y_train, y_ = train_test_split(X, y, test_size=0.40, random_state=1)
X_cv, X_test, y_cv, y_test = train_test_split(x_, y_, test_size=0.50, random_state=1)

# Scale features
scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(X_train)
x_cv_scaled = scaler.transform(X_cv)
x_test_scaled = scaler.transform(X_test)

# Create and train Random Forest
rf_model = RandomForestClassifier(
    n_estimators=100,      
    random_state=42,        
    max_depth=10,          
    min_samples_split=5,   
    min_samples_leaf=2     
)
rf_model.fit(x_train_scaled, y_train)

# Test different thresholds for Random Forest
thresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
best_f1 = 0
best_threshold = 0.5
best_yhat = None

print("Random Forest Threshold Testing:")
print("=" * 50)

for thresh in thresholds:
    # Get probability predictions
    yhat_proba = rf_model.predict_proba(x_cv_scaled)[:, 1]
    # Apply threshold
    yhat = np.where(yhat_proba >= thresh, 1, 0)
    
    f1 = f1_score(y_cv, yhat, zero_division=0)
    precision = precision_score(y_cv, yhat, zero_division=0)
    recall = recall_score(y_cv, yhat, zero_division=0)
    accuracy = accuracy_score(y_cv, yhat)
    
    print(f"Threshold {thresh}: F1={f1:.3f}, Precision={precision:.3f}, Recall={recall:.3f}, Accuracy={accuracy:.3f}")
    
    if f1 > best_f1:
        best_f1 = f1
        best_threshold = thresh
        best_yhat = yhat

print(f"\nBest threshold: {best_threshold} with F1={best_f1:.3f}")
print("\nClassification Report:")
print(classification_report(y_cv, best_yhat))

# Test Random Forest on test set
yhat_test_proba = rf_model.predict_proba(x_test_scaled)[:, 1]
yhat_test = np.where(yhat_test_proba >= best_threshold, 1, 0)

print(f"\nRANDOM FOREST TEST SET RESULTS:")
print(f"Threshold used: {best_threshold}")
print(f"Accuracy: {accuracy_score(y_test, yhat_test):.3f}")
print(f"Precision: {precision_score(y_test, yhat_test):.3f}")
print(f"Recall: {recall_score(y_test, yhat_test):.3f}")
print(f"F1 Score: {f1_score(y_test, yhat_test):.3f}")
print("\nClassification Report:")
print(classification_report(y_test, yhat_test)) 