import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHQ9_ITEMS, scorePHQ9, riskLevel, buildReport } from "../utils/assessmentLogic";
import { saveRecord, logAction } from "../utils/storage";

export default function Questionnaire() {
  const nav = useNavigate();
  const [answers, setAnswers] = useState(Array(9).fill(0));

  const score = useMemo(() => scorePHQ9(answers), [answers]);
  const risk = useMemo(() => riskLevel(score), [score]);

  const onChange = (idx, val) => {
    const next = [...answers];
    next[idx] = Number(val);
    setAnswers(next);
  };

  const submit = () => {
    const id = crypto.randomUUID?.() || String(Date.now());
    const report = buildReport({ score, risk, tags: [], text: "" });

    const record = {
      id,
      created_at: new Date().toISOString(),
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

  const selectStyle = {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.35)",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: 16,
    outline: "none",
  };

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

      <p style={{ color: "#cbd5e1", fontSize: 18, marginBottom: 18, lineHeight: 1.8 }}>
        0 = 完全没有　1 = 几天　2 = 一半以上天数　3 = 几乎每天
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

          <select
            value={answers[i]}
            onChange={(e) => onChange(i, e.target.value)}
            style={selectStyle}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      ))}

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          padding: 16,
          borderRadius: 14,
          border: "1px solid rgba(148,163,184,.22)",
          background: "rgba(15,23,42,.35)",
        }}
      >
        <div style={{ color: "#e2e8f0", fontSize: 18 }}>
          当前得分：<b style={{ color: "#f8fafc" }}>{score}</b>
          {"  "}｜{"  "}
          风险等级：<b style={{ color: "#f8fafc" }}>{risk}</b>
        </div>

        <button onClick={submit} style={submitBtnStyle}>
          提交生成报告
        </button>
      </div>

      {risk === "高" && (
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 12,
            background: "rgba(239,68,68,.18)",
            border: "1px solid rgba(248,113,113,.28)",
            color: "#fee2e2",
            lineHeight: 1.8,
          }}
        >
          <b>安全提示：</b>如有自伤、自杀想法或其他紧急风险，请及时联系校心理中心、家人朋友或拨打 120 / 110。
        </div>
      )}
    </div>
  );
}