from pathlib import Path
import pandas as pd
import joblib
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score

PROCESSED_ROOT = Path("ml/processed_data")
CHECKPOINT_ROOT = Path("ml/checkpoints")
OUTPUT_ROOT = Path("ml/outputs")
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

THRESHOLD = 0.40

test_df = pd.read_csv(PROCESSED_ROOT / "test.csv")

vectorizer = joblib.load(CHECKPOINT_ROOT / "tfidf_vectorizer_daic.pkl")
model = joblib.load(CHECKPOINT_ROOT / "tfidf_lr_model_daic.pkl")

X_test = vectorizer.transform(test_df["text"].astype(str).tolist())
y_test = test_df["label_binary"].astype(int).tolist()

proba = model.predict_proba(X_test)[:, 1]
pred = (proba >= THRESHOLD).astype(int)

print("===== TEST @ threshold =", THRESHOLD, "=====")
print(classification_report(y_test, pred, zero_division=0))

metrics = {
    "threshold": THRESHOLD,
    "test_accuracy": accuracy_score(y_test, pred),
    "test_precision": precision_score(y_test, pred, zero_division=0),
    "test_recall": recall_score(y_test, pred, zero_division=0),
    "test_f1": f1_score(y_test, pred, zero_division=0),
    "error_count": int((pred != y_test).sum()),
}

result_df = test_df.copy()
result_df["prob_1"] = proba
result_df["predicted_label_threshold"] = pred
result_df["is_correct"] = (result_df["predicted_label_threshold"] == result_df["label_binary"]).astype(int)

output_path = OUTPUT_ROOT / "test_predictions_daic_threshold_040.csv"
result_df.to_csv(output_path, index=False, encoding="utf-8-sig")

print("\n===== 指标汇总 =====")
print(metrics)
print("\n预测结果已保存到：", output_path)