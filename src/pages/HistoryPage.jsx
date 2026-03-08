import { clearHistory, clearLogs, readHistory, readLogs, logAction } from "../utils/storage";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const history = readHistory();
  const logs = readLogs();

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ history, logs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mh_data_export.json";
    a.click();
    URL.revokeObjectURL(url);
    logAction("export_data");
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2>历史记录（闭环证明）</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={exportJson} style={{ padding: "8px 12px", borderRadius: 10 }}>导出 JSON</button>
        <button onClick={() => { clearHistory(); logAction("clear_history"); window.location.reload(); }} style={{ padding: "8px 12px", borderRadius: 10 }}>
          清空评估记录
        </button>
        <button onClick={() => { clearLogs(); window.location.reload(); }} style={{ padding: "8px 12px", borderRadius: 10 }}>
          清空留痕
        </button>
      </div>

      <div style={{ padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
        <h3>评估记录</h3>
        {history.length === 0 && <p>暂无记录。</p>}
        {history.map((h) => (
          <div key={h.id} style={{ marginTop: 10, padding: 12, borderRadius: 12, background: "rgba(255,255,255,.06)" }}>
            <div><b>{new Date(h.created_at).toLocaleString()}</b> ｜ {h.type}</div>
            <div>分数：{h.phq9_score ?? "-"} ｜ 风险：{h.risk_level} ｜ 标签：{h.tags?.join(", ") || "无"}</div>
            <div style={{ marginTop: 8 }}>
              <Link to={`/result?id=${encodeURIComponent(h.id)}`} onClick={() => logAction("open_record", { id: h.id })}>查看报告</Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
        <h3>操作留痕（审计展示：前端版）</h3>
        {logs.length === 0 && <p>暂无操作记录。</p>}
        {logs.slice(0, 30).map((l, i) => (
          <div key={i} style={{ marginTop: 8, opacity: 0.9 }}>
            {new Date(l.at).toLocaleString()} ｜ <b>{l.action}</b> ｜ {JSON.stringify(l.payload)}
          </div>
        ))}
      </div>
    </div>
  );
}