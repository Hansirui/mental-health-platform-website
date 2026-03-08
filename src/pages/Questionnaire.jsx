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

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2>问卷评估（PHQ-9）</h2>
      <p style={{ opacity: 0.8 }}>0=完全没有 1=几天 2=一半以上天数 3=几乎每天</p>

      {PHQ9_ITEMS.map((q, i) => (
        <div key={i} style={{ marginTop: 12, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ marginBottom: 8 }}>{i + 1}. {q}</div>
          <select value={answers[i]} onChange={(e) => onChange(i, e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      ))}

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>当前得分：<b>{score}</b> ｜ 风险等级：<b>{risk}</b></div>
        <button onClick={submit} style={{ padding: "10px 16px", borderRadius: 10, background: "#3b82f6", color: "#fff", border: "none" }}>
          提交生成报告
        </button>
      </div>

      {risk === "高" && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(239,68,68,.15)" }}>
          <b>安全提示：</b>如有自伤/自杀想法或紧急风险，请及时联系校心理中心/家人朋友/120/110。
        </div>
      )}
    </div>
  );
}