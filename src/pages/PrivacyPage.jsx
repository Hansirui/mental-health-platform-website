import { Link } from "react-router-dom";

export default function PrivacyPage() {
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

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Link to="/result" style={linkBtnStyle}>返回结果页</Link>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
      </div>

      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 18, color: "#f8fafc" }}>
        隐私与数据管理（中期演示版）
      </h2>

      <div style={cardStyle}>
        <p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
          <b style={{ color: "#f8fafc" }}>本页面用于说明：</b>
          我们遵循“尽量本地处理、最小化上传”的原则。
        </p>

        <ul style={{ color: "#cbd5e1", lineHeight: 1.9, paddingLeft: 22, marginTop: 14 }}>
          <li>评估记录、计划勾选、操作留痕：默认仅保存在浏览器 localStorage（本地）。</li>
          <li>语音功能中期仅做入口展示，不上传原始语音。</li>
          <li>你可以在“历史记录”页面导出或清空数据。</li>
        </ul>

        <p style={{ color: "#94a3b8", marginTop: 16, lineHeight: 1.8 }}>
          提示：后续接入后端时，会进一步补充权限控制、日志审计和更完整的数据管理能力。
        </p>

        <div style={{ marginTop: 14 }}>
          <Link to="/history" style={linkBtnStyle}>
            去历史记录（导出 / 清空）
          </Link>
        </div>
      </div>
    </div>
  );
}