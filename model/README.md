# Crop Recommendation System — Model Module

## Required files

| File | Purpose |
|---|---|
| `Crop_recommendation.csv` | Training data (2200 rows, 22 crop classes, columns: N, P, K, temperature, humidity, ph, rainfall, label) |
| `train_model.py` | Full training/evaluation pipeline (Steps 1–10). Run once to produce the two files below. |
| `crop_recommendation_model.pkl` | The trained, selected model (saved with joblib) |
| `label_encoder.pkl` | Converts the model's numeric output back into a crop name — **required alongside the model file**, not optional |
| `predict.py` | Loads the two `.pkl` files and exposes `predict_crop()` for use elsewhere in the project (e.g. a web backend, app) |

Install dependencies once:
```bash
pip install pandas scikit-learn xgboost joblib matplotlib seaborn
```

## How to (re)train the model

```bash
python train_model.py
```
This loads the CSV, trains both Random Forest and XGBoost, prints accuracy/precision/recall/F1 for each, plots confusion matrices, checks for overfitting (train-vs-test gap + 5-fold cross-validation), picks the better model by F1-score, and saves it as `crop_recommendation_model.pkl` + `label_encoder.pkl`.

## How the project lead uses the saved model

You do **not** need to retrain anything to use the model elsewhere in the project (backend API, app, notebook, etc.). Just:

```python
from predict import predict_crop

crop, confidence = predict_crop([90, 42, 43, 20.8, 82.0, 6.5, 202.9])
print(crop, confidence)
# e.g. "rice", 0.88
```

Requirements to run this:
- `predict.py`, `crop_recommendation_model.pkl`, and `label_encoder.pkl` must all be in the same folder (or `predict.py`'s load paths updated to point to wherever they live).
- `pip install scikit-learn xgboost joblib numpy` in whatever environment is calling it.

### Input / Output format

**Input:** a list or array of exactly 7 numeric values, in this fixed order:

```
[N, P, K, temperature, humidity, ph, rainfall]
```

| Position | Feature | Typical training-data range |
|---|---|---|
| 0 | N (nitrogen) | 0 – 140 |
| 1 | P (phosphorus) | 5 – 145 |
| 2 | K (potassium) | 5 – 205 |
| 3 | temperature (°C) | 8.8 – 43.7 |
| 4 | humidity (%) | 14.3 – 100 |
| 5 | ph | 3.5 – 9.9 |
| 6 | rainfall (mm) | 20.2 – 298.6 |

Inputs outside these ranges are **not rejected** — the model will still return an answer, but that answer should be treated with reduced trust (see Limitations below).

**Output:** a tuple `(crop_name: str, confidence: float)`, e.g. `("rice", 0.88)`. `confidence` is between 0 and 1 — the probability the model assigned to its top prediction.

## Model performance (from actual evaluation — not assumed)

Evaluated on a stratified 20% held-out test set (440 samples), 5-fold cross-validation on the training set:

| Metric | Random Forest | XGBoost |
|---|---|---|
| Accuracy | 0.9955 | 0.9909 |
| Precision (macro) | 0.9957 | 0.9915 |
| Recall (macro) | 0.9955 | 0.9909 |
| F1-score (macro) | 0.9955 | 0.9908 |
| Train–test accuracy gap | 0.0045 | 0.0091 |
| 5-fold CV mean ± std | 0.9932 ± 0.0043 | 0.9892 ± 0.0049 |

**Random Forest was selected** — it led on every metric, had a smaller overfitting gap, and cross-validation confirmed the result is stable across different data splits, not a lucky single split.

Feature importance (Random Forest): rainfall (0.23) and humidity (0.22) drove the most predictive power, followed by K (0.18), P (0.15), N (0.10), temperature (0.07), and ph (0.05) — this reflects which features best separate the 22 crop classes in this specific dataset, not a general agronomic ranking of what matters for growing any given crop.

## Limitations — read before deploying or presenting this

1. **No input validation.** Tested directly: pH = 14 (chemically implausible for soil) returned "rice" at 89% confidence; rainfall = 5000mm (far beyond the training data's max of ~299mm) returned "rice" at 96% confidence. The model cannot detect nonsensical input.
2. **Static dataset.** Trained once on 2200 rows from a single fixed source. It reflects only the conditions/regions represented in that dataset — not your specific location, current season, or soil type. It will not improve or update unless retrained on new data.
3. **Correlation, not causation.** The model learned statistical associations between input ranges and labels; it has no agronomic reasoning.
4. **Confidence is not the same as correctness.** A high confidence score reflects internal agreement across the model's decision trees — it does not certify the input made physical sense.
5. **No regional, seasonal, or economic context.** The dataset doesn't encode location, season, water cost, or market price — all of which matter for a real planting decision.

**This tool is a decision-support aid, not a substitute for soil testing, agricultural extension services, or a qualified agronomist.**
