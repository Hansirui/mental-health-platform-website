from pathlib import Path
import json
import joblib

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ===== 路径配置 =====
PROJECT_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_DIR = PROJECT_ROOT / "ml" / "checkpoints"
DB_PATH = Path(__file__).resolve().with_name("db.json")

VECTORIZER_PATH = CHECKPOINT_DIR / "tfidf_vectorizer.pkl"
MODEL_PATH = CHECKPOINT_DIR / "tfidf_lr_model.pkl"

# ===== 加载模型 =====
vectorizer = joblib.load(VECTORIZER_PATH)
model = joblib.load(MODEL_PATH)


def predict_risk(text: str):
    x = vectorizer.transform([text])
    pred = int(model.predict(x)[0])

    risk_level = "高风险" if pred == 1 else "低风险"

    return {
        "predicted_label": pred,
        "risk_level": risk_level,
        "model_name": "tfidf_lr"
    }


def load_records():
    if not DB_PATH.exists():
        return []

    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            return data

        if isinstance(data, dict) and "records" in data and isinstance(data["records"], list):
            return data["records"]

        return []
    except Exception:
        return []


def save_records(records):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Mental health text prediction API is running."
    })


@app.route("/predict_text", methods=["POST"])
def predict_text():
    data = request.get_json(silent=True)

    if not data or "text" not in data:
        return jsonify({
            "error": "请求体中缺少 text 字段"
        }), 400

    text = str(data["text"]).strip()

    if not text:
        return jsonify({
            "error": "text 不能为空"
        }), 400

    result = predict_risk(text)

    return jsonify({
        "input_text": text,
        **result
    })


@app.route("/records", methods=["POST"])
def create_record():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "请求体不能为空"}), 400

    records = load_records()
    records.append(data)
    save_records(records)

    return jsonify({
        "message": "record saved",
        "record": data
    }), 201


@app.route("/records/latest", methods=["GET"])
def get_latest_record():
    records = load_records()

    if not records:
        return jsonify({"error": "暂无记录"}), 404

    return jsonify(records[-1])


@app.route("/records/<record_id>", methods=["GET"])
def get_record_by_id(record_id):
    records = load_records()

    for record in reversed(records):
        if str(record.get("id")) == str(record_id):
            return jsonify(record)

    return jsonify({"error": "未找到对应记录"}), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5051, debug=True)