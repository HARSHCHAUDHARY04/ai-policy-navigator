from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="AI Policy Recommendation ML Service")

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("✅ ML Model loaded successfully")
    else:
        print("❌ ML Model not found. Run train_model.py first.")

class UserProfile(BaseModel):
    age: int
    income: int # 0, 1, 2
    smoker: int # 0, 1
    dependents: int
    health_risk: int # 0, 1

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
def predict_policy(profile: UserProfile):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Prepare data for prediction
    try:
        data_dict = profile.model_dump()
        features = pd.DataFrame([data_dict])
        
        # Predict probabilities
        probs = model.predict_proba(features)[0]
        
        # Map back to human-readable types
        type_map = {0: "health", 1: "life", 2: "auto", 3: "property"}
        results = []
        
        for i, prob in enumerate(probs):
            results.append({
                "type": type_map[i],
                "confidence": float(round(prob, 4))
            })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
    
    # Sort by confidence
    results.sort(key=lambda x: x["confidence"], reverse=True)
    
    return {"recommendations": results}

if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable for deployment (Render/Heroku/etc)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
