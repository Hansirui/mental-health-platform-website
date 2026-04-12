import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveRecord, logAction } from "../utils/storage";

export default function TextInput() {
  const nav = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("请输入近况文本后再提交。");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5051/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedText,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "文本评估请求失败");
      }

      const record = await response.json();

      saveRecord(record);
      logAction("submit_text", {
        id: record.id,
        risk_level: record.risk_level,
        tags: record.tags || [],
      });

      nav(`/result?id=${encodeURIComponent(record.id)}`);
    } catch (err) {
      console.error("Text assessment submit failed:", err);
      setError(err.message || "文本分析接口调用失败，请确认 Flask 后端已启动。");
    } finally {
      setLoading(false);
    }
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
    background: loading ? "#64748b" : "#2563eb",
    color: "#fff",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: 700,
    fontSize: 15,
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, color: "#f8fafc" }}>
        文本输入
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
        请输入近两周的困扰，例如睡眠、压力、情绪、学习、人际等情况。
      </p>

      <div style={cardStyle}>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={textareaStyle}
          placeholder="例如：最近压力很大，晚上睡不好，情绪有点低落，注意力也不太集中……"
          disabled={loading}
        />

        <div style={{ marginTop: 12, color: "#94a3b8", fontSize: 14 }}>
          当前字数：{text.trim().length}
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

        <div style={{ marginTop: 18 }}>
          <button onClick={submit} style={submitBtnStyle} disabled={loading}>
            {loading ? "生成中..." : "生成报告"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
        <Link to="/result" style={linkBtnStyle}>查看最近结果</Link>
      </div>
    </div>
  );
}