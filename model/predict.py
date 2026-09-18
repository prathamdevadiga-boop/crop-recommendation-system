"""
Crop Recommendation System — Prediction Module
==================================================================
Loads the saved model and provides predict_crop() for inference.

Requires these two files in the same directory (produced by train_model.py):
    crop_recommendation_model.pkl
    label_encoder.pkl

Usage:
    from predict import predict_crop
    crop, confidence = predict_crop([90, 42, 43, 20.8, 82.0, 6.5, 202.9])
"""

import numpy as np
import joblib

DISCLAIMER = (
    "This prediction is a data-driven suggestion based on statistical "
    "patterns learned from a fixed historical dataset. It is NOT "
    "guaranteed agricultural advice. It does not account for your "
    "specific soil texture, local climate trends, pest pressure, market "
    "conditions, or region-specific agronomic factors, and it cannot "
    "detect physically implausible inputs. Always confirm with soil "
    "testing and a qualified agronomist before making planting decisions."
)

_MODEL_PATH = "crop_recommendation_model.pkl"
_ENCODER_PATH = "label_encoder.pkl"

_model = joblib.load(_MODEL_PATH)
_label_encoder = joblib.load(_ENCODER_PATH)

FEATURE_ORDER = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


def predict_crop(features):
    """
    Predicts the recommended crop given soil and climate readings.

    Parameters
    ----------
    features : list or array-like of 7 numeric values, in this exact order:
        [N, P, K, temperature, humidity, ph, rainfall]

    Returns
    -------
    (crop_name: str, confidence: float)
        confidence is the model's probability for its top prediction (0-1).

    Note
    ----
    The model performs no input validation. Values outside realistic
    ranges (e.g. negative nutrient levels, pH > 14, rainfall far beyond
    the training data) will still produce a confident-looking answer.
    See DISCLAIMER above.
    """
    if len(features) != 7:
        raise ValueError(
            f"Expected 7 features {FEATURE_ORDER}, got {len(features)}."
        )

    features_array = np.array(features, dtype=float).reshape(1, -1)
    probabilities = _model.predict_proba(features_array)[0]

    predicted_class_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_class_index])
    crop_name = _label_encoder.inverse_transform([predicted_class_index])[0]

    return crop_name, confidence


def predict_crop_verbose(features):
    """Same as predict_crop, but also prints the disclaimer. Use this in
    any user-facing demo/CLI so the limitation is never silently omitted."""
    crop, confidence = predict_crop(features)
    print(f"Predicted crop: {crop}")
    print(f"Confidence: {confidence:.2%}")
    print(f"\nNote: {DISCLAIMER}")
    return crop, confidence


# ----------------------------------------------------------------------
# STEP 11: Manual test cases — valid and unusual inputs
# ----------------------------------------------------------------------
if __name__ == "__main__":
    test_cases = {
        "Typical rice-like conditions": [90, 42, 43, 21, 82, 6.5, 200],
        "Typical coffee-like conditions": [100, 20, 30, 25, 55, 6.5, 150],
        "Desert-like edge case": [20, 20, 20, 35, 20, 6.0, 25],
        "UNUSUAL: negative nitrogen": [-10, 42, 43, 21, 82, 6.5, 200],
        "UNUSUAL: pH = 14 (chemically implausible for soil)": [90, 42, 43, 21, 82, 14.0, 200],
        "UNUSUAL: all zeros": [0, 0, 0, 0, 0, 0, 0],
        "UNUSUAL: extreme rainfall (5000mm, far beyond training range)": [90, 42, 43, 21, 82, 6.5, 5000],
    }

    for label, values in test_cases.items():
        crop, conf = predict_crop(values)
        flag = " <-- interpret with caution, see DISCLAIMER" if "UNUSUAL" in label else ""
        print(f"{label}: predicted={crop}, confidence={conf:.2%}{flag}")
