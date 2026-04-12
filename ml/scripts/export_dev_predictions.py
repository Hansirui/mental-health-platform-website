from pathlib import Path
import json
import joblib
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHECKPOINT_DIR = PROJECT_ROOT / "ml" / "checkpoints"
DATA_DIR = PROJECT_ROOT / "ml" / "processed_data"
OUTPUT_DIR = PROJECT_ROOT / "ml" / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

vectorizer = joblib.load(CHECKPOINT_DIR / "tfidf_vectorizer.pkl")
model = joblib.load(CHECKPOINT_DIR / "tfidf_lr_model.pkl")

dev_df = pd.read_csv(DATA_DIR / "dev.csv")

X_dev = vectorizer.transform(dev_df["text"].astype(str).tolist())
pred = model.predict(X_dev)

dev_df = dev_df.copy()
dev_df["predicted_label"] = pred
dev_df["risk_level"] = dev_df["predicted_label"].apply(lambda x: "高风险" if int(x) == 1 else "低风险")
dev_df["is_correct"] = (dev_df["phq8_binary"] == dev_df["predicted_label"]).astype(int)
dev_df["text_preview"] = dev_df["text"].astype(str).apply(lambda x: x[:200] + "..." if len(x) > 200 else x)

records = []
for _, row in dev_df.iterrows():
    records.append({
        "participant_id": int(row["participant_id"]),
        "true_label": int(row["phq8_binary"]),
        "phq8_score": int(row["phq8_score"]),
        "predicted_label": int(row["predicted_label"]),
        "risk_level": row["risk_level"],
        "is_correct": int(row["is_correct"]),
        "text_preview": row["text_preview"],
        "model_name": "tfidf_lr"
    })

output_path = OUTPUT_DIR / "dev_predictions.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print("导出完成：", output_path)
print("共导出样本数：", len(records))