import { Link } from "react-router-dom";

const graphData = [
  {
    category: "症状",
    items: ["失眠", "情绪低落", "注意力不集中", "疲惫乏力"],
  },
  {
    category: "诱因",
    items: ["学业压力", "人际关系紧张", "睡眠紊乱", "长期焦虑"],
  },
  {
    category: "干预",
    items: ["规律作息", "呼吸放松", "情绪记录", "寻求支持"],
  },
  {
    category: "禁忌",
    items: ["过度自我诊断", "长期压抑不求助", "极端负面暗示"],
  },
];

export default function GraphPage() {
  const pageStyle = {
    maxWidth: 1080,
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

  const nodeStyle = {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(59,130,246,.12)",
    border: "1px solid rgba(96,165,250,.22)",
    color: "#f8fafc",
    fontWeight: 600,
    display: "inline-block",
    marginRight: 10,
    marginBottom: 10,
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
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
        <Link to="/result" style={linkBtnStyle}>返回结果页</Link>
      </div>

      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 18, color: "#f8fafc" }}>
        知识图谱展示
      </h2>

      <div style={cardStyle}>
        <p style={{ color: "#cbd5e1", lineHeight: 1.8, marginBottom: 20 }}>
          当前展示的是中期演示版小型知识图谱，围绕“症状—诱因—干预—禁忌”构建基础节点结构，
          用于支撑结果解释与建议生成。
        </p>

        {graphData.map((group, index) => (
          <div key={index} style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#f8fafc", marginBottom: 12 }}>{group.category}</h3>
            <div>
              {group.items.map((item, idx) => (
                <span key={idx} style={nodeStyle}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h3 style={{ color: "#f8fafc", marginBottom: 12 }}>示例关系说明</h3>
        <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
          <div>失眠 → 可能关联 → 情绪低落</div>
          <div>学业压力 → 可能诱发 → 焦虑 / 睡眠问题</div>
          <div>情绪低落 → 建议干预 → 情绪记录 / 支持系统</div>
          <div>高风险状态 → 禁忌 → 延迟求助 / 过度自我诊断</div>
        </div>
      </div>
    </div>
  );
}