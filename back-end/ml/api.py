from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
from sentence_transformers import SentenceTransformer


app = FastAPI(title="Grocery Classifier API")



base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'models/classifier.joblib')
label_path = os.path.join(base_dir, 'models/labels.joblib')

try:
    clf = joblib.load(model_path)
    label_encoder = joblib.load(label_path)
    encoder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    print("Model assets loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")


class ProductRequest(BaseModel):
    name: str


@app.post("/classify")
async def classify_product(request: ProductRequest):
    if not request.name:
        raise HTTPException(status_code=400, detail="Product name is required")
    
    try:

        vector = encoder.encode([request.name])
        

        prediction_idx = clf.predict(vector)[0]
        

        category = label_encoder.inverse_transform([prediction_idx])[0]
        
        return {
            "product": request.name,
            "category": category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def health_check():
    return {"status": "online", "model": "ready"}