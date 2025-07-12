"use client";
import { useState } from "react";

const initialState = {
  age: "",
  gender: "Male",
  blood_pressure: "",
  cholesterol_level: "",
  exercise_habits: "Low",
  smoking: "No",
  family_heart_disease: "No",
  diabetes: "No",
  bmi: "",
  high_blood_pressure: "No",
  low_hdl_cholesterol: "No",
  high_ldl_cholesterol: "No",
  alcohol_consumption: "Low",
  stress_level: "Low",
  sleep_hours: "",
  sugar_consumption: "Low",
  triglyceride_level: "",
  fasting_blood_sugar: "",
  crp_level: "",
  homocysteine_level: "",
};

const fieldDescriptions: Record<string, string> = {
  age: "Your age in years.",
  gender: "Biological sex (Male or Female).",
  blood_pressure: "Systolic blood pressure (mmHg).",
  cholesterol_level: "Total cholesterol level (mg/dL).",
  exercise_habits: "How often you exercise (Low, Medium, High).",
  smoking: "Do you currently smoke?",
  family_heart_disease: "Any family history of heart disease?",
  diabetes: "Have you been diagnosed with diabetes?",
  bmi: "Body Mass Index (weight/height²).",
  high_blood_pressure: "Have you been diagnosed with high blood pressure?",
  low_hdl_cholesterol: "Is your HDL (good) cholesterol low?",
  high_ldl_cholesterol: "Is your LDL (bad) cholesterol high?",
  alcohol_consumption: "How much alcohol do you consume? (Low, Medium, High)",
  stress_level: "Your typical stress level (Low, Medium, High).",
  sleep_hours: "Average hours of sleep per night.",
  sugar_consumption: "How much sugar do you consume? (Low, Medium, High)",
  triglyceride_level: "Triglyceride level in blood (mg/dL).",
  fasting_blood_sugar: "Fasting blood sugar level (mg/dL).",
  crp_level: "C-reactive protein level (mg/L).",
  homocysteine_level: "Homocysteine level (µmol/L).",
};

function InfoIcon({ description }: { description: string }) {
  return (
    <span className="relative group inline-block align-middle ml-1">
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        className="text-red-400 inline"
        aria-label="Info"
      >
        <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="2" fill="#fff" />
      </svg>
      <span className="absolute left-1/2 z-10 hidden group-hover:block group-focus:block w-max min-w-[180px] max-w-xs -translate-x-1/2 bg-white text-red-700 border border-red-200 rounded px-3 py-2 text-xs shadow-lg mt-2">
        {description}
      </span>
    </span>
  );
}

export default function HeartForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/classify_heart_disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: parseFloat(form.age),
          blood_pressure: parseInt(form.blood_pressure),
          cholesterol_level: parseInt(form.cholesterol_level),
          bmi: parseFloat(form.bmi),
          sleep_hours: parseFloat(form.sleep_hours),
          triglyceride_level: parseFloat(form.triglyceride_level),
          fasting_blood_sugar: parseFloat(form.fasting_blood_sugar),
          crp_level: parseFloat(form.crp_level),
          homocysteine_level: parseFloat(form.homocysteine_level),
        }),
      });
      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setResult(data.prediction || JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 border-t-8 border-red-600 mt-8">
      <h2 className="text-3xl font-extrabold text-center text-red-700 mb-4">Find out if you are at risk of heart disease</h2>
      <div className="flex items-center gap-2 mb-6">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#dc2626" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <h1 className="text-2xl font-bold text-red-700">Heart Disease Risk Predictor</h1>
      </div>
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-red-700 font-semibold">Age
              <InfoIcon description={fieldDescriptions.age} />
            </label>
            <input type="number" name="age" value={form.age} onChange={handleChange} required min="0" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Gender
              <InfoIcon description={fieldDescriptions.gender} />
            </label>
            <select name="gender" value={form.gender} onChange={handleChange} className="input">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Blood Pressure
              <InfoIcon description={fieldDescriptions.blood_pressure} />
            </label>
            <input type="number" name="blood_pressure" value={form.blood_pressure} onChange={handleChange} required min="0" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Cholesterol Level
              <InfoIcon description={fieldDescriptions.cholesterol_level} />
            </label>
            <input type="number" name="cholesterol_level" value={form.cholesterol_level} onChange={handleChange} required min="0" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Exercise Habits
              <InfoIcon description={fieldDescriptions.exercise_habits} />
            </label>
            <select name="exercise_habits" value={form.exercise_habits} onChange={handleChange} className="input">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Smoking
              <InfoIcon description={fieldDescriptions.smoking} />
            </label>
            <select name="smoking" value={form.smoking} onChange={handleChange} className="input">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Family Heart Disease
              <InfoIcon description={fieldDescriptions.family_heart_disease} />
            </label>
            <select name="family_heart_disease" value={form.family_heart_disease} onChange={handleChange} className="input">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Diabetes
              <InfoIcon description={fieldDescriptions.diabetes} />
            </label>
            <select name="diabetes" value={form.diabetes} onChange={handleChange} className="input">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">BMI
              <InfoIcon description={fieldDescriptions.bmi} />
            </label>
            <input type="number" name="bmi" value={form.bmi} onChange={handleChange} required min="0" step="0.1" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">High Blood Pressure
              <InfoIcon description={fieldDescriptions.high_blood_pressure} />
            </label>
            <select name="high_blood_pressure" value={form.high_blood_pressure} onChange={handleChange} className="input">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Low HDL Cholesterol
              <InfoIcon description={fieldDescriptions.low_hdl_cholesterol} />
            </label>
            <select name="low_hdl_cholesterol" value={form.low_hdl_cholesterol} onChange={handleChange} className="input">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">High LDL Cholesterol
              <InfoIcon description={fieldDescriptions.high_ldl_cholesterol} />
            </label>
            <select name="high_ldl_cholesterol" value={form.high_ldl_cholesterol} onChange={handleChange} className="input">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Alcohol Consumption
              <InfoIcon description={fieldDescriptions.alcohol_consumption} />
            </label>
            <select name="alcohol_consumption" value={form.alcohol_consumption} onChange={handleChange} className="input">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Stress Level
              <InfoIcon description={fieldDescriptions.stress_level} />
            </label>
            <select name="stress_level" value={form.stress_level} onChange={handleChange} className="input">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Sleep Hours
              <InfoIcon description={fieldDescriptions.sleep_hours} />
            </label>
            <input type="number" name="sleep_hours" value={form.sleep_hours} onChange={handleChange} required min="0" step="0.1" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Sugar Consumption
              <InfoIcon description={fieldDescriptions.sugar_consumption} />
            </label>
            <select name="sugar_consumption" value={form.sugar_consumption} onChange={handleChange} className="input">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Triglyceride Level
              <InfoIcon description={fieldDescriptions.triglyceride_level} />
            </label>
            <input type="number" name="triglyceride_level" value={form.triglyceride_level} onChange={handleChange} required min="0" step="0.1" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Fasting Blood Sugar
              <InfoIcon description={fieldDescriptions.fasting_blood_sugar} />
            </label>
            <input type="number" name="fasting_blood_sugar" value={form.fasting_blood_sugar} onChange={handleChange} required min="0" step="0.1" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">CRP Level
              <InfoIcon description={fieldDescriptions.crp_level} />
            </label>
            <input type="number" name="crp_level" value={form.crp_level} onChange={handleChange} required min="0" step="0.1" className="input" />
          </div>
          <div>
            <label className="block text-red-700 font-semibold">Homocysteine Level
              <InfoIcon description={fieldDescriptions.homocysteine_level} />
            </label>
            <input type="number" name="homocysteine_level" value={form.homocysteine_level} onChange={handleChange} required min="0" step="0.1" className="input" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-md">
          {loading ? "Predicting..." : "Predict Heart Disease Risk"}
        </button>
      </form>
      {result && (
        <div className={`mt-6 p-4 rounded text-center font-semibold border ${result.toLowerCase().includes('yes') ? 'bg-red-100 border-red-400 text-red-800' : 'bg-green-50 border-green-400 text-green-800'}`}>
          {(() => {
            let res = result;
            try {
              if (typeof result === 'string' && result.startsWith('{')) {
                res = JSON.parse(result).result;
              }
            } catch {}
            if (typeof res === 'string' && res.toLowerCase() === 'yes') {
              return (
                <>
                  <span className="text-2xl">⚠️</span><br />
                  <span>You may be at risk of heart disease. Please consult a healthcare professional for further advice.</span>
                </>
              );
            } else if (typeof res === 'string' && res.toLowerCase() === 'no') {
              return (
                <>
                  <span className="text-2xl">✅</span><br />
                  <span>You are not at risk of heart disease according to this assessment.</span>
                </>
              );
            } else {
              return `Prediction: ${result}`;
            }
          })()}
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded text-red-800 font-semibold text-center">
          Error: {error}
        </div>
      )}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #f87171;
          border-radius: 0.5rem;
          background: #fff;
          color: #991b1b;
          font-size: 1rem;
          margin-top: 0.25rem;
          outline: none;
          transition: border 0.2s;
        }
        .input:focus {
          border-color: #dc2626;
        }
        .group:hover .group-hover\\:block, .group:focus .group-focus\\:block {
          display: block;
        }
      `}</style>
    </div>
  );
} 