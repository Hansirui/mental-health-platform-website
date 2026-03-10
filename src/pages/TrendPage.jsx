import { Link } from "react-router-dom";
import { readHistory } from "../utils/storage";

export default function TrendPage() {
  const history = readHistory();

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

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
        <Link to="/history" style={linkBtnStyle}>去历史记录</Link>
      </div>

      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 18, color: "#f8fafc" }}>
        趋势分析
      </h2>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 26, marginBottom: 14, color: "#f8fafc" }}>最近评估趋势</h3>

        {latestFive.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>暂无评估记录，先去完成一次问卷或文本输入。</p>
        ) : (
          <>
            <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
              {latestFive.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    marginTop: 10,
                    padding: 12,
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
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ color: "#f8fafc", marginBottom: 10 }}>分数变化（简化展示）</h4>
              <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
                {latestFive.map((item, index) => (
                  <div key={item.id || index}>
                    第 {index + 1} 次：{item.phq9_score ?? "-"}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
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