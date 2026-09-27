<p align="center">
  <img src="app/public/icon.svg" alt="Crop Recommendation System Logo" width="80" />
</p>

<h1 align="center">🌾 Crop Recommendation System</h1>

<p align="center">
  <strong>An intelligent, ML-powered web application that recommends the best crop to grow based on soil nutrients and real-time weather conditions.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#model-details">Model Details</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#team">Team</a> •
  <a href="#license">License</a>
</p>

---

## 📌 Overview

Enter your soil's **Nitrogen (N)**, **Phosphorus (P)**, **Potassium (K)**, **pH** values and a **city or district name** — the system automatically fetches live temperature, humidity, and rainfall data for your location, feeds all 7 parameters into a trained ML model, and returns:

- ✅ **Recommended crop** best suited for your conditions
- 📊 **Confidence score** indicating prediction reliability
- 🌤️ **Live weather data** for the entered location
- 📈 **N-P-K nutrient chart** visualizing your soil profile

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **ML Prediction** | Trained on 2,200+ samples across 22 crop classes using Random Forest & XGBoost |
| 🌦️ **Live Weather** | Automatically fetches real-time temperature, humidity & rainfall via Open-Meteo API |
| 🎨 **Modern UI** | Responsive Next.js + TypeScript frontend with a clean, intuitive design |
| ⚡ **Fast API** | Python FastAPI backend with input validation and health monitoring |
| 🔒 **Input Validation** | Server-side validation for all soil parameters and location input |
| 📱 **Responsive** | Works seamlessly on desktop, tablet, and mobile devices |

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌─────────────────────────────────┐
│                     │  HTTP   │                                 │
│   Next.js Frontend  │────────▶│   FastAPI Backend               │
│   (TypeScript)      │         │                                 │
│                     │◀────────│   ┌──────────┐  ┌────────────┐  │
└─────────────────────┘         │   │ Weather  │  │  ML Model  │  │
                                │   │ Module   │  │ (predict)  │  │
                                │   └────┬─────┘  └────────────┘  │
                                └────────┼────────────────────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Open-Meteo API  │
                                │  (weather data)  │
                                └─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | scikit-learn, XGBoost, pandas, NumPy, joblib |
| **Weather Data** | Open-Meteo API (free, no API key required) |
| **Deployment** | Render (backend), Vercel (frontend) |

---

## 📁 Project Structure

```
crop-recommendation-system/
├── app/                          # Next.js frontend application
│   ├── app/                      #   App router (pages, layouts, server actions)
│   ├── components/               #   React components (recommender, charts, cards)
│   ├── lib/                      #   Utility functions and type definitions
│   └── public/                   #   Static assets (icons, favicon)
│
├── backend/
│   ├── __init__.py               #   Package marker
│   └── main.py                   #   FastAPI application (health, weather, predict)
│
├── model/
│   ├── train_model.py            #   Training pipeline (Random Forest + XGBoost)
│   ├── evaluation.py             #   Metrics, confusion matrices, overfitting checks
│   ├── predict.py                #   Prediction interface — loads model & exposes predict_crop()
│   ├── crop_model.pkl            #   Saved trained model (Random Forest)
│   ├── label_encoder.pkl         #   Label encoder for crop name mapping
│   ├── confusion_matrices.png    #   Model evaluation visualization
│   ├── feature_importance.png    #   Feature importance chart
│   └── README.md                 #   Detailed model documentation
│
├── data/
│   └── raw/
│       └── Crop_recommendation.csv   # Training dataset (2,200 rows × 8 columns)
│
├── weather_api.py                # Open-Meteo weather helper module
├── requirements.txt              # Python dependencies
├── render.yaml                   # Render deployment config
├── LICENSE                       # MIT License
└── README.md                     # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** (with npm or pnpm)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/prathamdevadiga-boop/crop-recommendation-system.git
cd crop-recommendation-system
```

### 2. Set Up the Backend

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.main:app --reload
```

The API server starts at `http://127.0.0.1:8000`. Verify it's running:

```bash
curl http://127.0.0.1:8000/health
# → {"status": "ok"}
```

### 3. Set Up the Frontend

Open a **new terminal** and run:

```bash
cd app

# Install Node dependencies (using pnpm)
npx --yes pnpm install

# Start the development server
npx --yes pnpm run dev
```

The frontend starts at `http://localhost:3000`. Open it in your browser and start predicting!

### 4. (Optional) Retrain the Model

If you want to retrain the ML model from scratch:

```bash
cd model
python train_model.py
```

This regenerates `crop_model.pkl` and `label_encoder.pkl`.

---

## 📡 API Reference

Base URL: `http://127.0.0.1:8000`

### `GET /health`

Health check endpoint.

**Response:**
```json
{ "status": "ok" }
```

### `GET /weather?location={city}`

Fetch live weather data for a location.

| Parameter | Type | Description |
|---|---|---|
| `location` | string | City or district name (1–100 chars) |

**Response:**
```json
{
  "temperature": 25.3,
  "humidity": 78.5,
  "rainfall": 120.2
}
```

### `POST /predict`

Get a crop recommendation.

**Request Body:**
```json
{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

**Response:**
```json
{
  "crop": "rice",
  "confidence": 0.88,
  "explanation": "This recommendation is based on the supplied soil nutrients and live weather readings. ..."
}
```

| Field | Valid Range |
|---|---|
| `nitrogen` | 0 – 140 |
| `phosphorus` | 0 – 145 |
| `potassium` | 0 – 205 |
| `temperature` | -20 – 60 °C |
| `humidity` | 0 – 100 % |
| `ph` | 0 – 14 |
| `rainfall` | 0 – 300 mm |

---

## 🧠 Model Details

### Training Pipeline

The model is trained using `model/train_model.py`, which:

1. Loads the dataset (2,200 rows, 22 crop classes)
2. Encodes crop labels numerically
3. Splits data 80/20 with stratified sampling
4. Trains both **Random Forest** and **XGBoost** classifiers
5. Evaluates accuracy, precision, recall, F1 on the test set
6. Checks for overfitting (train-vs-test gap + 5-fold cross-validation)
7. Selects the best model by macro F1-score
8. Saves the model and label encoder as `.pkl` files

### Performance Metrics

| Metric | Random Forest | XGBoost |
|---|---|---|
| Accuracy | **0.9955** | 0.9909 |
| Precision (macro) | **0.9957** | 0.9915 |
| Recall (macro) | **0.9955** | 0.9909 |
| F1-score (macro) | **0.9955** | 0.9908 |
| Train–test gap | **0.0045** | 0.0091 |
| 5-fold CV mean ± std | **0.9932 ± 0.0043** | 0.9892 ± 0.0049 |

> **Random Forest was selected** — it leads on every metric with a smaller overfitting gap.

### Feature Importance

| Feature | Importance |
|---|---|
| Rainfall | 0.23 |
| Humidity | 0.22 |
| Potassium (K) | 0.18 |
| Phosphorus (P) | 0.15 |
| Nitrogen (N) | 0.10 |
| Temperature | 0.07 |
| pH | 0.05 |

### ⚠️ Limitations

- **No input validation for plausibility** — the model accepts any numeric input even if physically impossible
- **Static dataset** — trained on 2,200 rows from a single source; doesn't adapt to new data
- **No regional/seasonal context** — doesn't account for location-specific factors, season, or economics
- **Confidence ≠ correctness** — high confidence only reflects internal model agreement

> **This is a decision-support tool, not a substitute for soil testing or professional agricultural advice.**

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Quick Start

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/crop-recommendation-system.git
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and test them locally
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push** and open a **Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

| Prefix | Use for |
|---|---|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructuring |
| `chore:` | Maintenance tasks |

### What You Can Contribute

- 🐛 Bug fixes and error handling improvements
- 🎨 UI/UX enhancements
- 📊 Additional model features or alternative algorithms
- 📝 Documentation improvements
- 🧪 Adding test coverage
- 🌍 Multi-language support
- 📱 Mobile responsiveness improvements

---

## 👥 Team

| Contributor | Role |
|---|---|
| **Pratham K** | Project Lead — Full-stack integration, backend, deployment |
| **Gowrav** | ML Engineer — Model training, evaluation, prediction module |
| **Gurudev** | Data Engineer — Data collection, cleaning, analysis, preprocessing |
| **Dhanya Shetty** | Frontend & UI Design |
| **Riyagouda** | Weather API Integration |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 💚 for sustainable agriculture
</p>
