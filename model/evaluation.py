"""
Crop Recommendation System — Evaluation Module
==================================================================
Metrics (accuracy/precision/recall/F1), confusion matrix plotting,
overfitting checks, and feature importance — kept separate from
train_model.py so training logic and evaluation logic don't mix.

These functions are imported by train_model.py; you normally won't
run this file directly.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import cross_val_score
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix
)


# ----------------------------------------------------------------------
# Accuracy, precision, recall, F1
# ----------------------------------------------------------------------
def evaluate_model(model, X_test, y_test, model_name):
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    # macro average = every crop class weighted equally, regardless of
    # frequency — appropriate here since the dataset is perfectly balanced
    prec = precision_score(y_test, y_pred, average="macro")
    rec = recall_score(y_test, y_pred, average="macro")
    f1 = f1_score(y_test, y_pred, average="macro")

    print(f"\n===== {model_name} =====")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-score:  {f1:.4f}")

    return y_pred, {"accuracy": acc, "precision": prec, "recall": rec, "f1": f1}


# ----------------------------------------------------------------------
# Confusion matrices, side by side
# ----------------------------------------------------------------------
def plot_confusion_matrices(y_test, rf_pred, xgb_pred, class_names,
                             save_path="confusion_matrices.png"):
    fig, axes = plt.subplots(1, 2, figsize=(20, 8))
    for ax, pred, name in [
        (axes[0], rf_pred, "Random Forest"),
        (axes[1], xgb_pred, "XGBoost"),
    ]:
        cm = confusion_matrix(y_test, pred)
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                    xticklabels=class_names, yticklabels=class_names, ax=ax)
        ax.set_title(f"{name} — Confusion Matrix")
        ax.set_xlabel("Predicted")
        ax.set_ylabel("Actual")
        plt.setp(ax.get_xticklabels(), rotation=90)
        plt.setp(ax.get_yticklabels(), rotation=0)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.show()


# ----------------------------------------------------------------------
# Overfitting check: train-vs-test gap + 5-fold cross-validation
# ----------------------------------------------------------------------
def check_overfitting(model, X_train, y_train, X_test, y_test, model_name):
    train_acc = accuracy_score(y_train, model.predict(X_train))
    test_acc = accuracy_score(y_test, model.predict(X_test))
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)

    print(f"\n===== {model_name}: Overfitting check =====")
    print(f"Training accuracy: {train_acc:.4f}")
    print(f"Testing accuracy:  {test_acc:.4f}")
    print(f"Gap (train-test):  {train_acc - test_acc:.4f}")
    print(f"5-fold CV scores:  {np.round(cv_scores, 4)}")
    print(f"CV mean ± std:     {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    return {
        "train_acc": train_acc, "test_acc": test_acc,
        "gap": train_acc - test_acc,
        "cv_mean": cv_scores.mean(), "cv_std": cv_scores.std()
    }


# ----------------------------------------------------------------------
# Feature importance
# ----------------------------------------------------------------------
def show_feature_importance(model, feature_names, save_path="feature_importance.png"):
    importances = model.feature_importances_
    importance_df = pd.DataFrame({
        "feature": feature_names, "importance": importances
    }).sort_values("importance", ascending=False)

    print("\n===== Feature Importance =====")
    print(importance_df.to_string(index=False))

    plt.figure(figsize=(10, 6))
    plt.barh(importance_df["feature"], importance_df["importance"], color="seagreen")
    plt.xlabel("Importance")
    plt.title("Random Forest — Feature Importance")
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.show()

    return importance_df
