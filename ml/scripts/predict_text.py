from pathlib import Path
import joblib

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHECKPOINT_DIR = PROJECT_ROOT / "ml" / "checkpoints"

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
pred = model.predict(X)[0]

risk_level = "高风险" if pred == 1 else "低风险"

print("\n===== 预测结果 =====")
print("预测标签:", int(pred))
print("风险等级:", risk_level)
print("输入摘要:", user_text[:200] + ("..." if len(user_text) > 200 else ""))