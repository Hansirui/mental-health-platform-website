import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { readPlan, writePlan, logAction } from "../utils/storage";

const TASKS = [
  { id: "sleep", title: "睡眠卫生", detail: "固定作息；睡前1小时不看屏幕；下午少咖啡因。" },
  { id: "breath", title: "呼吸放松", detail: "4-7-8 呼吸 4 轮，或 3 分钟腹式呼吸。" },
  { id: "journal", title: "情绪记录", detail: "事件-想法-情绪-应对（2分钟即可）。" },
  { id: "walk", title: "轻运动", detail: "散步10分钟或拉伸5分钟。" },
];

export default function PlanPage() {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => i + 1), []);
  const [done, setDone] = useState(readPlan());

  const toggle = (k, meta) => {
    const next = { ...done, [k]: !done[k] };
    setDone(next);
    writePlan(next);
    logAction("toggle_plan", { ...meta, checked: next[k] });
  };

  return (
    <div style={{ maxWidth: 980, margin: "24px auto", padding: 16, color: "#e5e7eb" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Link
          to="/result"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,.35)",
            background: "#1e293b",
            color: "#f8fafc",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          返回结果页
        </Link>

        <Link
          to="/"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,.35)",
            background: "#1e293b",
            color: "#f8fafc",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          返回首页
        </Link>
      </div>

      <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>7 天轻干预计划（演示版）</h2>
      <p style={{ color: "#cbd5e1", marginBottom: 20 }}>勾选完成情况（本地保存）。</p>

      {days.map((d) => (
        <div
          key={d}
          style={{
            marginTop: 18,
            padding: 20,
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,.22)",
            background: "rgba(15,23,42,.35)",
            boxShadow: "0 6px 20px rgba(0,0,0,.18)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 30, color: "#f8fafc" }}>第 {d} 天</h3>

          {TASKS.map((t) => {
            const k = `${d}-${t.id}`;
            return (
              <label
                key={k}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginTop: 14,
                  cursor: "pointer",
                  color: "#e2e8f0",
                  lineHeight: 1.8,
                  fontSize: 18,
                }}
              >
                <input
                  type="checkbox"
                  checked={!!done[k]}
                  onChange={() => toggle(k, { day: d, task: t.id })}
                  style={{
                    marginTop: 6,
                    width: 18,
                    height: 18,
                    accentColor: "#60a5fa",
                    flexShrink: 0,
                  }}
                />
                <span>
                  <b style={{ color: "#f8fafc" }}>{t.title}</b>：{t.detail}
                </span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}