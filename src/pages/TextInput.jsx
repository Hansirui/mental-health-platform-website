import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2>文本输入</h2>
      <p style={{ opacity: 0.8 }}>请输入近两周的困扰（睡眠/压力/情绪/学习/人际等）。</p>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 10 }}
        placeholder="例如：最近压力很大，睡不好，注意力差..."
      />

      <div style={{ marginTop: 12, opacity: 0.85 }}>
        识别标签：<b>{keywordTags(text).join(", ") || "无"}</b>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={submit} style={{ padding: "10px 16px", borderRadius: 10, background: "#3b82f6", color: "#fff", border: "none" }}>
          生成报告
        </button>
      </div>
    </div>
  );
}