import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { readHistory } from "../utils/storage";

export default function TrendPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceText, setSourceText] = useState("正在加载后端数据...");

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5051/records");

        if (!response.ok) {
          throw new Error("Failed to fetch backend records");
        }

        const data = await response.json();
        setHistory(Array.isArray(data) ? data : []);
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

  const infoCardStyle = {
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.05)",
    minWidth: 180,
    color: "#e2e8f0",
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

  const latestFive = useMemo(() => history.slice(0, 5).reverse(), [history]);
  const latest = history[0] || null;
  const previous = history[1] || null;

  const getTypeLabel = (type) => {
    if (type === "questionnaire") return "问卷";
    if (type === "text") return "文本";
    if (type === "combined") return "联合评估";
    return type || "未知";
  };

  const getRiskStyle = (risk) => {
    if (risk === "高风险") return { color: "#fca5a5" };
    if (risk === "中风险") return { color: "#fdba74" };
    if (risk === "轻度关注") return { color: "#fde68a" };
    return { color: "#86efac" };
  };

  const getScoreDiffText = () => {
    if (!latest || !previous) return "暂无可对比的上一条记录";
    if (latest.phq9_score == null || previous.phq9_score == null) return "最近两条记录中至少有一条无量表分数";
    const diff = latest.phq9_score - previous.phq9_score;
    if (diff > 0) return `较上一次 +${diff}`;
    if (diff < 0) return `较上一次 ${diff}`;
    return "较上一次无变化";
    };

  const getRiskDiffText = () => {
    if (!latest || !previous) return "暂无可对比的上一条记录";
    if (latest.risk_level === previous.risk_level) return "风险等级无变化";
    return `由 ${previous.risk_level || "-"} 变化为 ${latest.risk_level || "-"}`;
  };

  const renderScoreBar = (score) => {
    const safeScore = Number(score) || 0;
    const width = `${Math.min(safeScore * 4, 100)}%`;

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

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>最近记录数</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>{history.length}</div>
        </div>

        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>最近一次类型</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>{latest ? getTypeLabel(latest.type) : "-"}</div>
        </div>

        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>最近一次风险</div>
          <div style={{ ...getRiskStyle(latest?.risk_level), fontWeight: 800 }}>
            {latest?.risk_level || "-"}
          </div>
        </div>

        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>最近一次 PHQ-9</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>
            {latest?.phq9_score ?? "-"}
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 18 }}>
        <h3 style={{ fontSize: 24, marginBottom: 14, color: "#f8fafc" }}>
          变化摘要
        </h3>

        <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
          <div>分数变化：{getScoreDiffText()}</div>
          <div>风险变化：{getRiskDiffText()}</div>
        </div>
      </div>

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
                    {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    类型：{getTypeLabel(item.type)} ｜ 分数：{item.phq9_score ?? "-"} ｜ 风险：
                    <span style={{ ...getRiskStyle(item.risk_level), fontWeight: 700 }}>
                      {" "}{item.risk_level || "-"}
                    </span>
                  </div>

                  <div style={{ marginTop: 6 }}>
                    标签：{item.tags?.join("，") || "无"}
                  </div>

                  {item.text ? (
                    <div style={{ marginTop: 6, color: "#94a3b8", lineHeight: 1.7 }}>
                      文本摘要：{item.text.length > 50 ? `${item.text.slice(0, 50)}...` : item.text}
                    </div>
                  ) : null}

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
                    第 {index + 1} 次：{item.risk_level || "-"}
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