from pathlib import Path
import pandas as pd
import joblib

PROCESSED_ROOT = Path("ml/processed_data")
CHECKPOINT_ROOT = Path("ml/checkpoints")
OUTPUT_ROOT = Path("ml/outputs")
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

test_df = pd.read_csv(PROCESSED_ROOT / "test.csv")

vectorizer = joblib.load(CHECKPOINT_ROOT / "tfidf_vectorizer_daic.pkl")
model = joblib.load(CHECKPOINT_ROOT / "tfidf_lr_model_daic.pkl")

X_test = vectorizer.transform(test_df["text"].astype(str).tolist())

pred = model.predict(X_test)
proba = model.predict_proba(X_test)

result_df = test_df.copy()
result_df["predicted_label"] = pred
result_df["prob_0"] = proba[:, 0]
result_df["prob_1"] = proba[:, 1]
result_df["is_correct"] = (result_df["label_binary"] == result_df["predicted_label"]).astype(int)

output_path = OUTPUT_ROOT / "test_predictions_daic.csv"
result_df.to_csv(output_path, index=False, encoding="utf-8-sig")

print("导出完成：", output_path)
print("总样本数：", len(result_df))
print("预测错误样本数：", int((result_df["is_correct"] == 0).sum()))

print("\n错误样本预览：")
print(result_df[result_df["is_correct"] == 0][
    ["participant_id", "label_score", "label_binary", "predicted_label", "prob_1", "text"]
].head(10))