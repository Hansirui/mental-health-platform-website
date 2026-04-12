from pathlib import Path
import numpy as np
import pandas as pd
import joblib
from sklearn.metrics import f1_score, precision_score, recall_score

PROCESSED_ROOT = Path("ml/processed_data")
CHECKPOINT_ROOT = Path("ml/checkpoints")

dev_df = pd.read_csv(PROCESSED_ROOT / "dev.csv")

vectorizer = joblib.load(CHECKPOINT_ROOT / "tfidf_vectorizer_daic.pkl")
model = joblib.load(CHECKPOINT_ROOT / "tfidf_lr_model_daic.pkl")

X_dev = vectorizer.transform(dev_df["text"].astype(str).tolist())
y_dev = dev_df["label_binary"].astype(int).values

proba = model.predict_proba(X_dev)[:, 1]

results = []
for threshold in np.arange(0.30, 0.71, 0.02):
    pred = (proba >= threshold).astype(int)
    f1 = f1_score(y_dev, pred, zero_division=0)
    precision = precision_score(y_dev, pred, zero_division=0)
    recall = recall_score(y_dev, pred, zero_division=0)

    results.append({
        "threshold": round(float(threshold), 2),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1": round(float(f1), 4),
    })

result_df = pd.DataFrame(results).sort_values("f1", ascending=False).reset_index(drop=True)

print("===== 阈值搜索结果（按 F1 排序）=====")
print(result_df.head(10))

best = result_df.iloc[0]
print("\n===== 最佳阈值 =====")
print(best)