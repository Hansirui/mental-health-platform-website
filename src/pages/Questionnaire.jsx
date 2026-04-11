import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHQ9_ITEMS } from "../utils/assessmentLogic";
import { saveRecord, logAction } from "../utils/storage";

export default function Questionnaire() {
  const nav = useNavigate();
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const optionItems = [
    { value: 0, label: " 完全没有" },
    { value: 1, label: " 偶尔几天" },
    { value: 2, label: " 一半以上天数" },
    { value: 3, label: " 几乎每天" },
  ];

  const onChange = (idx, val) => {
    const next = [...answers];
    next[idx] = Number(val);
    setAnswers(next);
    setError("");
  };

  const submit = async () => {
    const hasEmpty = answers.some((item) => item === null);

    if (hasEmpty) {
      setError("请先完成全部题目，再提交生成报告。");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5051/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phq9_answers: answers,
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "问卷评估请求失败");
      }

      const record = await response.json();

      saveRecord(record);
      logAction("submit_questionnaire", {
        id: record.id,
        score: record.phq9_score,
        risk: record.risk_level,
        tags: record.tags || [],
      });

      nav(`/result?id=${encodeURIComponent(record.id)}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "提交失败，请检查后端是否启动。");
    } finally {
      setSubmitting(false);
    }
  };

  const pageStyle = {
    maxWidth: 980,
    margin: "24px auto",
    padding: 16,
    color: "#e5e7eb",
  };

  const questionCardStyle = {
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.22)",
    background: "rgba(15,23,42,.35)",
    boxShadow: "0 6px 20px rgba(0,0,0,.18)",
  };

  const optionRowStyle = {
    marginTop: 14,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  };

  const optionBtnStyle = (active) => ({
    minWidth: 150,
    padding: "10px 18px",
    borderRadius: 10,
    border: active ? "1px solid #60a5fa" : "1px solid rgba(148,163,184,.35)",
    background: active ? "#2563eb" : "#0f172a",
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: active ? "0 0 0 2px rgba(96,165,250,.18)" : "none",
    textAlign: "center",
    whiteSpace: "nowrap",
  });

  const submitBtnStyle = {
    padding: "10px 16px",
    borderRadius: 10,
    background: submitting ? "#64748b" : "#2563eb",
    color: "#fff",
    border: "none",
    cursor: submitting ? "not-allowed" : "pointer",
    fontWeight: 700,
    fontSize: 15,
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 140,
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.28)",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: 16,
    lineHeight: 1.8,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, color: "#f8fafc" }}>
        问卷评估（PHQ-9）
      </h2>

      <div
        style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 12,
          background: "rgba(250,204,21,.12)",
          border: "1px solid rgba(250,204,21,.28)",
          color: "#fde68a",
          lineHeight: 1.8,
          fontSize: 15,
        }}
      >
        本系统仅用于初筛与建议，不替代专业诊断。
      </div>

      <p style={{ color: "#cbd5e1", fontSize: 18, marginBottom: 18, lineHeight: 1.8 }}>
        请选择每道题在近两周内出现的频率；也可以在下方补充近况描述，系统会生成更完整的综合报告。
      </p>

      {PHQ9_ITEMS.map((q, i) => (
        <div key={i} style={questionCardStyle}>
          <div
            style={{
              marginBottom: 8,
              fontSize: 18,
              lineHeight: 1.8,
              color: "#f8fafc",
              fontWeight: 500,
            }}
          >
            {i + 1}. {q}
          </div>

          <div style={optionRowStyle}>
            {optionItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange(i, item.value)}
                style={optionBtnStyle(answers[i] === item.value)}
                disabled={submitting}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ ...questionCardStyle, marginTop: 20 }}>
        <div style={{ fontSize: 18, color: "#f8fafc", fontWeight: 600, marginBottom: 10 }}>
          近况补充（可选）
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={textareaStyle}
          placeholder="例如：最近学习压力比较大，晚上经常失眠，情绪比较低落……"
          disabled={submitting}
        />
      </div>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            background: "rgba(239,68,68,.18)",
            border: "1px solid rgba(248,113,113,.28)",
            color: "#fee2e2",
            lineHeight: 1.8,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          padding: 16,
          borderRadius: 14,
          border: "1px solid rgba(148,163,184,.22)",
          background: "rgba(15,23,42,.35)",
        }}
      >
        <button onClick={submit} style={submitBtnStyle} disabled={submitting}>
          {submitting ? "提交中..." : "提交生成综合报告"}
        </button>
      </div>
    </div>
  );
}