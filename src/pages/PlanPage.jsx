import { useMemo, useState } from "react";
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
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2>7 天轻干预计划（演示版）</h2>
      <p style={{ opacity: 0.8 }}>勾选完成情况（本地保存）。</p>

      {days.map((d) => (
        <div key={d} style={{ marginTop: 14, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
          <h3 style={{ marginTop: 0 }}>第 {d} 天</h3>
          {TASKS.map((t) => {
            const k = `${d}-${t.id}`;
            return (
              <label key={k} style={{ display: "block", marginTop: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k, { day: d, task: t.id })} />
                <span style={{ marginLeft: 8 }}>
                  <b>{t.title}</b>：{t.detail}
                </span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}