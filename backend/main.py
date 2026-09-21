"""FastAPI bridge between the existing Next.js frontend and the Python ML code."""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model.predict import DISCLAIMER, predict_crop
from weather_api import get_weather_for_location

app = FastAPI(title="Crop Recommendation API", version="1.0.0")

# The Next.js server actions call this API server-to-server. CORS also makes
# local browser testing possible without changing the supplied frontend UI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    nitrogen: float = Field(ge=0, le=140)
    phosphorus: float = Field(ge=0, le=145)
    potassium: float = Field(ge=0, le=205)
    temperature: float = Field(ge=-20, le=60)
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0, le=300)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/weather")
def weather(location: str = Query(min_length=1, max_length=100)) -> dict[str, float]:
    try:
        return get_weather_for_location(city=location.strip())
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.post("/predict")
def predict(payload: PredictionRequest) -> dict[str, object]:
    features = [
        payload.nitrogen,
        payload.phosphorus,
        payload.potassium,
        payload.temperature,
        payload.humidity,
        payload.ph,
        payload.rainfall,
    ]
    crop, confidence = predict_crop(features)
    return {
        "crop": crop,
        "confidence": confidence,
        "explanation": (
            "This recommendation is based on the supplied soil nutrients and "
            "live weather readings. " + DISCLAIMER
        ),
    }
