import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHQ9_ITEMS, scorePHQ9, riskLevel, buildReport } from "../utils/assessmentLogic";
import { saveRecord, logAction } from "../utils/storage";

export default function Questionnaire() {
  const nav = useNavigate();
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [error, setError] = useState("");

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

  const submit = () => {
    const hasEmpty = answers.some((item) => item === null);

    if (hasEmpty) {
      setError("请先完成全部题目，再提交生成报告。");
      return;
    }

    const score = scorePHQ9(answers);
    const risk = riskLevel(score);

    const id = crypto.randomUUID?.() || String(Date.now());
    const report = buildReport({ score, risk, tags: [], text: "" });

    const now = new Date().toISOString();

    const record = {
      id,
      timestamp: now,
      created_at: now,
      type: "questionnaire",
      phq9_answers: answers,
      phq9_score: score,
      risk_level: risk,
      tags: [],
      text: "",
      report,
    };

    saveRecord(record);
    logAction("submit_questionnaire", { id, score, risk });

    fetch("http://localhost:3001/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    }).catch((error) => {
      console.error("Failed to save record to backend:", error);
    });

    nav(`/result?id=${encodeURIComponent(id)}`);
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
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
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
        请选择每道题在近两周内出现的频率，提交后将在结果页显示总分与风险等级。
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
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}

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
        <button onClick={submit} style={submitBtnStyle}>
          提交生成报告
        </button>
      </div>
    </div>
  );
}