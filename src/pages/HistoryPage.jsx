import { useEffect, useState } from "react";
import { clearHistory, clearLogs, readHistory, readLogs, logAction } from "../utils/storage";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceText, setSourceText] = useState("正在加载后端数据...");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:3001/records");

        if (!response.ok) {
          throw new Error("Failed to fetch backend records");
        }

        const data = await response.json();
        setHistory(data);
        setSourceText("当前显示：后端记录");
      } catch (error) {
        console.error("Failed to load backend history, fallback to localStorage:", error);
        setHistory(readHistory());
        setSourceText("当前显示：本地记录（后端读取失败）");
      } finally {
        setLogs(readLogs());
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ history, logs }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mh_data_export.json";
    a.click();
    URL.revokeObjectURL(url);
    logAction("export_data");
  };

  const handleClearHistory = () => {
    clearHistory();
    logAction("clear_history");
    window.location.reload();
  };

  const handleClearLogs = () => {
    clearLogs();
    window.location.reload();
  };

  const pageStyle = {
    maxWidth: 980,
    margin: "24px auto",
    padding: 16,
    color: "#e5e7eb",
  };

  const cardStyle = {
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.22)",
    background: "rgba(15,23,42,.35)",
    boxShadow: "0 6px 20px rgba(0,0,0,.18)",
  };

  const buttonStyle = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.35)",
    background: "#1e293b",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: 14,
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

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Link to="/result" style={linkBtnStyle}>返回结果页</Link>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
      </div>

      <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
        历史记录（闭环证明）
      </h2>

      <p style={{ color: "#94a3b8", marginBottom: 18 }}>
        {sourceText}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={exportJson} style={buttonStyle}>导出 JSON</button>
        <button onClick={handleClearHistory} style={buttonStyle}>清空评估记录</button>
        <button onClick={handleClearLogs} style={buttonStyle}>清空留痕</button>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>评估记录</h3>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>正在加载数据...</p>
        ) : history.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>暂无记录。</p>
        ) : (
          history.map((h) => (
            <div
              key={h.id}
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 12,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(148,163,184,.18)",
                color: "#e2e8f0",
              }}
            >
              <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                {new Date(h.created_at).toLocaleString()} ｜ {h.type}
              </div>

              <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                分数：{h.phq9_score ?? "-"} ｜ 风险：{h.risk_level} ｜ 标签：{h.tags?.join(", ") || "无"}
              </div>

              <div style={{ marginTop: 10 }}>
                <Link
                  to={`/result?id=${encodeURIComponent(h.id)}`}
                  onClick={() => logAction("open_record", { id: h.id })}
                  style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}
                >
                  查看报告
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>
          操作留痕（审计展示：前端版）
        </h3>

        {logs.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>暂无操作记录。</p>
        ) : (
          logs.slice(0, 30).map((l, i) => (
            <div
              key={i}
              style={{
                marginTop: 10,
                color: "#cbd5e1",
                lineHeight: 1.7,
                wordBreak: "break-all",
              }}
            >
              {new Date(l.at).toLocaleString()} ｜ <b style={{ color: "#f8fafc" }}>{l.action}</b> ｜{" "}
              <span style={{ color: "#94a3b8" }}>{JSON.stringify(l.payload)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}