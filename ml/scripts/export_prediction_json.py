from pathlib import Path
import json
import joblib

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHECKPOINT_DIR = PROJECT_ROOT / "ml" / "checkpoints"
OUTPUT_DIR = PROJECT_ROOT / "ml" / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

vectorizer_path = CHECKPOINT_DIR / "tfidf_vectorizer.pkl"
model_path = CHECKPOINT_DIR / "tfidf_lr_model.pkl"

vectorizer = joblib.load(vectorizer_path)
model = joblib.load(model_path)

print("请输入一段英文文本：")
user_text = input().strip()

if not user_text:
    print("输入为空，程序结束。")
    raise SystemExit

X = vectorizer.transform([user_text])
pred = int(model.predict(X)[0])

risk_level = "高风险" if pred == 1 else "低风险"

result = {
    "input_text": user_text,
    "predicted_label": pred,
    "risk_level": risk_level,
    "model_name": "tfidf_lr"
}

output_path = OUTPUT_DIR / "single_prediction.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("\n===== 导出完成 =====")
print(json.dumps(result, ensure_ascii=False, indent=2))
print("\n保存到:", output_path)