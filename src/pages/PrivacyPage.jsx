import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2>隐私与数据管理（中期演示版）</h2>

      <div style={{ padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
        <p><b>本页面用于说明：</b>我们遵循“尽量本地处理、最小化上传”的原则。</p>
        <ul>
          <li>评估记录、计划勾选、操作留痕：默认仅保存在浏览器 localStorage（本地）。</li>
          <li>语音功能中期仅做入口展示，不上传原始语音。</li>
          <li>你可以在“历史记录”页面导出/清空数据。</li>
        </ul>

        <p style={{ opacity: 0.8 }}>提示：后续接入后端时会增加权限控制与审计留痕能力。</p>

        <div style={{ marginTop: 12 }}>
          <Link to="/history">去历史记录（导出/清空）</Link>
        </div>
      </div>
    </div>
  );
}