from pathlib import Path
import json
import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

PROCESSED_ROOT = Path("ml/processed_data")
OUTPUT_ROOT = Path("ml/outputs")
CHECKPOINT_ROOT = Path("ml/checkpoints")

OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
CHECKPOINT_ROOT.mkdir(parents=True, exist_ok=True)

train_df = pd.read_csv(PROCESSED_ROOT / "train.csv")
dev_df = pd.read_csv(PROCESSED_ROOT / "dev.csv")
test_df = pd.read_csv(PROCESSED_ROOT / "test.csv")

# ===== 文本与标签 =====
X_train = train_df["text"].astype(str).tolist()
y_train = train_df["label_binary"].astype(int).tolist()

X_dev = dev_df["text"].astype(str).tolist()
y_dev = dev_df["label_binary"].astype(int).tolist()

X_test = test_df["text"].astype(str).tolist()
y_test = test_df["label_binary"].astype(int).tolist()

# ===== TF-IDF =====
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=1
)

X_train_vec = vectorizer.fit_transform(X_train)
X_dev_vec = vectorizer.transform(X_dev)
X_test_vec = vectorizer.transform(X_test)

# ===== LR =====
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model.fit(X_train_vec, y_train)

dev_pred = model.predict(X_dev_vec)
test_pred = model.predict(X_test_vec)

# ===== 指标 =====
metrics = {
    "dev_accuracy": accuracy_score(y_dev, dev_pred),
    "dev_precision": precision_score(y_dev, dev_pred, zero_division=0),
    "dev_recall": recall_score(y_dev, dev_pred, zero_division=0),
    "dev_f1": f1_score(y_dev, dev_pred, zero_division=0),

    "test_accuracy": accuracy_score(y_test, test_pred),
    "test_precision": precision_score(y_test, test_pred, zero_division=0),
    "test_recall": recall_score(y_test, test_pred, zero_division=0),
    "test_f1": f1_score(y_test, test_pred, zero_division=0),
}

print("===== DEV =====")
print(classification_report(y_dev, dev_pred, zero_division=0))

print("===== TEST =====")
print(classification_report(y_test, test_pred, zero_division=0))

with open(OUTPUT_ROOT / "tfidf_lr_daic_metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics, f, ensure_ascii=False, indent=2)

joblib.dump(vectorizer, CHECKPOINT_ROOT / "tfidf_vectorizer_daic.pkl")
joblib.dump(model, CHECKPOINT_ROOT / "tfidf_lr_model_daic.pkl")

print("\n===== 保存完成 =====")
print("指标文件：", OUTPUT_ROOT / "tfidf_lr_daic_metrics.json")
print("向量器：", CHECKPOINT_ROOT / "tfidf_vectorizer_daic.pkl")
print("模型：", CHECKPOINT_ROOT / "tfidf_lr_model_daic.pkl")
print(metrics)