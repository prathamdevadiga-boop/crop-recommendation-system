"""
Crop Recommendation System — Model Training Module
==================================================================
Trains and compares two classifiers (Random Forest, XGBoost) on the
Crop Recommendation dataset, selects the best one, and saves it with
joblib. Evaluation logic (metrics, confusion matrix, overfitting
check, feature importance) lives in evaluation.py — imported below.

Dataset columns expected:
    N, P, K, temperature, humidity, ph, rainfall, label

Run this script once to (re)produce:
    crop_model.pkl
    label_encoder.pkl

Author: Gowrav | Project: Crop Recommendation System
"""

import time
import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from evaluation import (
    evaluate_model, plot_confusion_matrices,
    check_overfitting, show_feature_importance
)


# ----------------------------------------------------------------------
# STEP 1: Load the preprocessed dataset
# ----------------------------------------------------------------------
def load_data(csv_path="../data/raw/Crop_recommendation.csv"):
    df = pd.read_csv(csv_path)

    print("Shape (rows, columns):", df.shape)
    print("Missing values total:", df.isnull().sum().sum())
    print("Number of crop classes:", df["label"].nunique())

    return df


# ----------------------------------------------------------------------
# STEP 2: Separate features and labels
# ----------------------------------------------------------------------
def split_features_labels(df):
    X = df.drop("label", axis=1)
    y = df["label"]

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    return X, y_encoded, le


# ----------------------------------------------------------------------
# STEP 3: Train/test split
# ----------------------------------------------------------------------
def split_train_test(X, y_encoded, test_size=0.2, random_state=42):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded,
        test_size=test_size,
        random_state=random_state,
        stratify=y_encoded  # preserves class balance in both sets
    )
    print("Training set:", X_train.shape, " Testing set:", X_test.shape)
    return X_train, X_test, y_train, y_test


# ----------------------------------------------------------------------
# STEP 4: Train models
# ----------------------------------------------------------------------
def train_models(X_train, y_train):
    rf_model = RandomForestClassifier(
        n_estimators=100, random_state=42, n_jobs=-1
    )
    start = time.time()
    rf_model.fit(X_train, y_train)
    print(f"Random Forest trained in {time.time() - start:.2f}s")

    xgb_model = XGBClassifier(
        n_estimators=100, random_state=42, eval_metric="mlogloss"
    )
    start = time.time()
    xgb_model.fit(X_train, y_train)
    print(f"XGBoost trained in {time.time() - start:.2f}s")

    return rf_model, xgb_model


# ----------------------------------------------------------------------
# Main pipeline: run everything end-to-end
# ----------------------------------------------------------------------
def main(csv_path="../data/raw/Crop_recommendation.csv"):
    df = load_data(csv_path)
    X, y_encoded, le = split_features_labels(df)
    X_train, X_test, y_train, y_test = split_train_test(X, y_encoded)

    rf_model, xgb_model = train_models(X_train, y_train)

    # STEP 5: Evaluate & compare (imported from evaluation.py)
    rf_pred, rf_metrics = evaluate_model(rf_model, X_test, y_test, "Random Forest")
    xgb_pred, xgb_metrics = evaluate_model(xgb_model, X_test, y_test, "XGBoost")
    plot_confusion_matrices(y_test, rf_pred, xgb_pred, le.classes_)

    # STEP 6: Overfitting check
    rf_overfit = check_overfitting(rf_model, X_train, y_train, X_test, y_test, "Random Forest")
    xgb_overfit = check_overfitting(xgb_model, X_train, y_train, X_test, y_test, "XGBoost")

    # STEP 7: Select best model — pick by F1 score (balances precision & recall)
    best_model, best_name = (
        (rf_model, "Random Forest") if rf_metrics["f1"] >= xgb_metrics["f1"]
        else (xgb_model, "XGBoost")
    )
    print(f"\n>>> Selected model: {best_name} (higher macro F1-score) <<<")

    # STEP 8: Save with joblib
    joblib.dump(best_model, "crop_model.pkl")
    joblib.dump(le, "label_encoder.pkl")
    print("Saved: crop_model.pkl, label_encoder.pkl")

    # STEP 10: Feature importance (only meaningful for tree models like these)
    show_feature_importance(best_model, X.columns)

    return {
        "rf_metrics": rf_metrics, "xgb_metrics": xgb_metrics,
        "rf_overfit": rf_overfit, "xgb_overfit": xgb_overfit,
        "best_model_name": best_name,
    }


if __name__ == "__main__":
    results = main()
