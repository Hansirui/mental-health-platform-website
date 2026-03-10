import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { keywordTags, buildReport } from "../utils/assessmentLogic";
import { saveRecord, logAction } from "../utils/storage";

export default function TextInput() {
  const nav = useNavigate();
  const [text, setText] = useState("");

  const submit = () => {
    const id = crypto.randomUUID?.() || String(Date.now());
    const tags = keywordTags(text);

    const score = 0;
    const risk = "低";
    const report = buildReport({ score, risk, tags, text });

    const record = {
      id,
      created_at: new Date().toISOString(),
      type: "text",
      phq9_answers: null,
      phq9_score: null,
      risk_level: risk,
      tags,
      text,
      report,
    };

    saveRecord(record);
    logAction("submit_text", { id, tags });

    nav(`/result?id=${encodeURIComponent(id)}`);
  };

  const pageStyle = {
    maxWidth: 980,
    margin: "24px auto",
    padding: 16,
    color: "#e5e7eb",
  };

  const cardStyle = {
    padding: 18,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.22)",
    background: "rgba(15,23,42,.35)",
    boxShadow: "0 6px 20px rgba(0,0,0,.18)",
  };

  const linkBtnStyle = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.35)",
    background: "#1e293b",
    color: "#f8fafc",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 180,
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
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
        <Link to="/result" style={linkBtnStyle}>查看最近结果</Link>
      </div>

      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, color: "#f8fafc" }}>
        文本输入
      </h2>

      <p style={{ color: "#cbd5e1", fontSize: 18, marginBottom: 18, lineHeight: 1.8 }}>
        请输入近两周的困扰，例如睡眠、压力、情绪、学习、人际等情况。
      </p>

      <div style={cardStyle}>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={textareaStyle}
          placeholder="例如：最近压力很大，晚上睡不好，情绪有点低落，注意力也不太集中……"
        />

        <div style={{ marginTop: 16, color: "#cbd5e1", fontSize: 17, lineHeight: 1.8 }}>
          识别标签：
          <b style={{ color: "#f8fafc" }}> {keywordTags(text).join("，") || "无"}</b>
        </div>

        <div style={{ marginTop: 18 }}>
          <button onClick={submit} style={submitBtnStyle}>
            生成报告
          </button>
        </div>
      </div>
    </div>
  );
}