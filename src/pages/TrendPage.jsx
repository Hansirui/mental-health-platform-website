import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readHistory } from "../utils/storage";

export default function TrendPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceText, setSourceText] = useState("正在加载后端数据...");

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await fetch("http://localhost:3001/records");

        if (!response.ok) {
          throw new Error("Failed to fetch backend records");
        }

        const data = await response.json();
        setHistory(data);
        setSourceText("当前显示：后端趋势数据");
      } catch (error) {
        console.error("Failed to load backend trend data, fallback to localStorage:", error);
        setHistory(readHistory());
        setSourceText("当前显示：本地趋势数据（后端读取失败）");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, []);

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

  const latestFive = history.slice(0, 5).reverse();

  const renderScoreBar = (score) => {
    const safeScore = Number(score) || 0;
    const width = `${Math.min(safeScore * 8, 100)}%`;

    return (
      <div
        style={{
          width: "100%",
          height: 12,
          background: "rgba(255,255,255,.08)",
          borderRadius: 999,
          overflow: "hidden",
          marginTop: 6,
        }}
      >
        <div
          style={{
            width,
            height: "100%",
            background: "#60a5fa",
            borderRadius: 999,
          }}
        />
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
        <Link to="/history" style={linkBtnStyle}>去历史记录</Link>
        <Link to="/result" style={linkBtnStyle}>查看最近结果</Link>
      </div>

      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, color: "#f8fafc" }}>
        趋势分析
      </h2>

      <p style={{ color: "#94a3b8", marginBottom: 18 }}>
        {sourceText}
      </p>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 26, marginBottom: 14, color: "#f8fafc" }}>
          最近评估趋势
        </h3>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>正在加载数据...</p>
        ) : latestFive.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>暂无评估记录，请先完成一次问卷评估或文本输入。</p>
        ) : (
          <>
            <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
              {latestFive.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    marginTop: 12,
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(148,163,184,.18)",
                  }}
                >
                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>
                    {new Date(item.created_at).toLocaleString()}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    类型：{item.type} ｜ 分数：{item.phq9_score ?? "-"} ｜ 风险：{item.risk_level}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    标签：{item.tags?.join("，") || "无"}
                  </div>

                  {item.phq9_score !== null && item.phq9_score !== undefined && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ color: "#94a3b8", fontSize: 14 }}>分数可视化</div>
                      {renderScoreBar(item.phq9_score)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22 }}>
              <h4 style={{ color: "#f8fafc", marginBottom: 10 }}>分数变化</h4>
              <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
                {latestFive.map((item, index) => (
                  <div key={item.id || index}>
                    第 {index + 1} 次：{item.phq9_score ?? "-"}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <h4 style={{ color: "#f8fafc", marginBottom: 10 }}>风险等级变化</h4>
              <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
                {latestFive.map((item, index) => (
                  <div key={item.id || index}>
                    第 {index + 1} 次：{item.risk_level}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}