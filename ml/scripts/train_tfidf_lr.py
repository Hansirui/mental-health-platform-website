import json
from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "processed_data"
OUTPUT_ROOT = PROJECT_ROOT / "ml" / "outputs"
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

train_df = pd.read_csv(DATA_ROOT / "train.csv")
dev_df = pd.read_csv(DATA_ROOT / "dev.csv")

X_train = train_df["text"].astype(str).tolist()
y_train = train_df["phq8_binary"].astype(int).tolist()

X_dev = dev_df["text"].astype(str).tolist()
y_dev = dev_df["phq8_binary"].astype(int).tolist()

vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), min_df=1)
X_train_vec = vectorizer.fit_transform(X_train)
X_dev_vec = vectorizer.transform(X_dev)

model = LogisticRegression(max_iter=1000, class_weight="balanced")
model.fit(X_train_vec, y_train)

dev_pred = model.predict(X_dev_vec)

metrics = {
    "dev_accuracy": accuracy_score(y_dev, dev_pred),
    "dev_precision": precision_score(y_dev, dev_pred, zero_division=0),
    "dev_recall": recall_score(y_dev, dev_pred, zero_division=0),
    "dev_f1": f1_score(y_dev, dev_pred, zero_division=0),
}

print("===== DEV =====")
print(classification_report(y_dev, dev_pred, zero_division=0))

with open(OUTPUT_ROOT / "tfidf_lr_metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics, f, ensure_ascii=False, indent=2)

print("指标已保存到:", OUTPUT_ROOT / "tfidf_lr_metrics.json")
print(metrics)