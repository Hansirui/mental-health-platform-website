from pathlib import Path
import json
import uuid
from datetime import datetime

import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ===== 路径配置 =====
PROJECT_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_DIR = PROJECT_ROOT / "ml" / "checkpoints"
DB_PATH = Path(__file__).resolve().with_name("db.json")

VECTORIZER_PATH = CHECKPOINT_DIR / "tfidf_vectorizer_daic.pkl"
MODEL_PATH = CHECKPOINT_DIR / "tfidf_lr_model_daic.pkl"

# ===== 加载模型 =====
vectorizer = joblib.load(VECTORIZER_PATH)
model = joblib.load(MODEL_PATH)


# =========================
# 工具函数
# =========================
def now_iso():
    return datetime.utcnow().isoformat() + "Z"


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


def score_phq9(answers):
    if not isinstance(answers, list):
        return None
    return sum(int(x or 0) for x in answers)


def risk_level_from_phq9(score):
    if score is None:
        return None
    if score >= 15:
        return "高风险"
    if score >= 10:
        return "中风险"
    if score >= 5:
        return "轻度关注"
    return "低风险"


def keyword_tags(text: str):
    t = (text or "").lower()
    rules = [
        ("失眠", ["睡不着", "睡不好", "失眠", "熬夜"]),
        ("焦虑", ["焦虑", "紧张", "慌", "害怕"]),
        ("自责", ["自责", "内疚", "没用", "失败"]),
        ("压力", ["压力", "崩溃", "撑不住", "deadline"]),
        ("情绪低落", ["难过", "低落", "沮丧", "绝望"]),
        ("兴趣下降", ["没兴趣", "提不起劲", "不想做"]),
    ]
    tags = []
    for tag, kws in rules:
        if any(k in t for k in kws):
            tags.append(tag)
    return list(dict.fromkeys(tags))


def detect_high_risk_text(text: str):
    t = (text or "").lower()
    high_risk_keywords = [
        "不如死",
        "不想活",
        "活着没意思",
        "自杀",
        "轻生",
        "伤害自己",
        "结束生命",
    ]
    return any(k in t for k in high_risk_keywords)


def predict_risk(text: str):
    x = vectorizer.transform([text])

    probs = model.predict_proba(x)[0]
    prob_0 = float(probs[0])
    prob_1 = float(probs[1])

    threshold = 0.40
    pred = 1 if prob_1 >= threshold else 0

    if prob_1 >= threshold:
        risk_level = "中风险"
    else:
        risk_level = "低风险"

    return {
        "predicted_label": pred,
        "risk_level": risk_level,
        "model_name": "tfidf_lr_daic",
        "threshold": threshold,
        "probability": {
            "label_0": prob_0,
            "label_1": prob_1
        }
    }


def build_recommendations(final_risk, tags):
    recs = [
        {"title": "规律作息", "detail": "尽量固定睡眠和起床时间，减少熬夜。"},
        {"title": "情绪记录", "detail": "每天记录一次情绪变化、诱因和应对方式。"},
    ]

    if "压力" in tags:
        recs.append({"title": "压力拆解", "detail": "把近期压力来源拆成可执行的小任务，逐项处理。"})
    if "失眠" in tags:
        recs.append({"title": "睡眠卫生", "detail": "睡前1小时减少刷手机，避免咖啡因。"})
    if final_risk in ["中风险", "高风险"]:
        recs.append({"title": "寻求支持", "detail": "建议联系老师、朋友、家人或学校心理中心沟通。"})
    return recs


def build_warnings(final_risk, high_risk_flag):
    warnings = [
        "本系统仅用于初筛与建议，不替代专业诊断。"
    ]
    if final_risk == "高风险" or high_risk_flag:
        warnings.append("检测到较高风险信号，请尽快联系学校心理中心、家人朋友或专业医疗机构。")
        warnings.append("若已出现明显自伤、自杀想法或现实危险，请立即寻求线下紧急帮助。")
    return warnings


def merge_final_risk(phq9_risk, text_risk, high_risk_flag):
    order = {
        "低风险": 0,
        "轻度关注": 1,
        "中风险": 2,
        "高风险": 3,
        None: -1,
    }

    final_risk = phq9_risk if order.get(phq9_risk, -1) >= order.get(text_risk, -1) else text_risk

    if high_risk_flag:
        final_risk = "高风险"

    return final_risk or "低风险"


def build_record_from_input(phq9_answers=None, text=""):
    created_at = now_iso()
    record_id = str(uuid.uuid4())

    phq9_score = score_phq9(phq9_answers) if phq9_answers else None
    phq9_risk = risk_level_from_phq9(phq9_score)

    text = (text or "").strip()
    tags = keyword_tags(text)
    high_risk_flag = detect_high_risk_text(text)

    baseline_result = None
    text_risk = None
    if text:
        baseline_result = predict_risk(text)
        text_risk = baseline_result["risk_level"]

    final_risk = merge_final_risk(phq9_risk, text_risk, high_risk_flag)

    explanations = []
    if phq9_score is not None:
        explanations.append(f"PHQ-9 得分为 {phq9_score}。")
    if tags:
        explanations.append(f"文本中识别到线索：{'、'.join(tags)}。")
    if high_risk_flag:
        explanations.append("文本中检测到高风险表达，需要优先安全提醒。")
    if not explanations:
        explanations.append("当前结果主要基于基础规则生成。")

    symptom_signals = tags[:]

    record_type = "combined"
    if phq9_answers and not text:
        record_type = "questionnaire"
    elif text and not phq9_answers:
        record_type = "text"
    elif not phq9_answers and not text:
        record_type = "empty"

    report = {
        "summary": "基于量表与文本线索生成的初筛报告。",
        "recommendations": build_recommendations(final_risk, tags),
        "contraindications": [
            {"title": "避免替代诊断", "detail": "本系统输出不能替代专业医生或心理咨询师判断。"},
            {"title": "避免忽视高风险信号", "detail": "若已出现明显危险想法，请优先线下求助。"},
        ],
        "evidence_paths": [
            {
                "path": [
                    f"PHQ-9得分={phq9_score}" if phq9_score is not None else "无量表输入",
                    f"文本标签={','.join(tags)}" if tags else "无明显文本标签",
                    f"最终风险={final_risk}",
                ],
                "source": "assessment-rule",
                "confidence": 0.8,
            }
        ],
    }

    record = {
        "id": record_id,
        "timestamp": created_at,
        "created_at": created_at,
        "type": record_type,
        "phq9_answers": phq9_answers,
        "phq9_score": phq9_score,
        "risk_level": final_risk,
        "tags": tags,
        "text": text,
        "symptom_signals": symptom_signals,
        "explanations": explanations,
        "recommendations": report["recommendations"],
        "warnings": build_warnings(final_risk, high_risk_flag),
        "report": report,
        "baseline_result": baseline_result,
    }

    return record


# =========================
# 路由
# =========================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Mental health assessment API is running."
    })


@app.route("/predict_text", methods=["POST"])
def predict_text():
    data = request.get_json(silent=True)

    if not data or "text" not in data:
        return jsonify({"error": "请求体中缺少 text 字段"}), 400

    text = str(data["text"]).strip()
    if not text:
        return jsonify({"error": "text 不能为空"}), 400

    result = predict_risk(text)

    return jsonify({
        "input_text": text,
        **result
    })


@app.route("/assessment", methods=["POST"])
def assessment():
    data = request.get_json(silent=True) or {}

    phq9_answers = data.get("phq9_answers")
    text = data.get("text", "")

    if not phq9_answers and not str(text).strip():
        return jsonify({"error": "phq9_answers 和 text 不能同时为空"}), 400

    if phq9_answers is not None:
        if not isinstance(phq9_answers, list) or len(phq9_answers) != 9:
            return jsonify({"error": "phq9_answers 必须是长度为 9 的数组"}), 400

    record = build_record_from_input(phq9_answers=phq9_answers, text=text)

    records = load_records()
    records.append(record)
    save_records(records)

    return jsonify(record), 201


@app.route("/records", methods=["GET", "POST"])
def records_handler():
    if request.method == "GET":
        records = load_records()
        return jsonify(records)

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