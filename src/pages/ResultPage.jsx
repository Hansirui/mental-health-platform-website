import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getLatestRecord, getRecord, logAction } from "../utils/storage";

export default function ResultPage() {
  const [sp] = useSearchParams();
  const id = sp.get("id");
  const record = id ? getRecord(id) : getLatestRecord();

  useEffect(() => {
    logAction("view_result", { id: id || "latest" });
  }, [id]);

  if (!record) {
    return (
      <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
        <h2>结果展示</h2>
        <p>暂无记录，请先完成问卷评估或文本输入。</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/questionnaire">去问卷评估</Link>
          <Link to="/text">去文本输入</Link>
        </div>
      </div>
    );
  }

  const { phq9_score, risk_level, tags, report, created_at, type } = record;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2>结果报告</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ opacity: 0.8 }}>来源</div>
          <div style={{ fontWeight: 800 }}>{type}</div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ opacity: 0.8 }}>时间</div>
          <div style={{ fontWeight: 800 }}>{new Date(created_at).toLocaleString()}</div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ opacity: 0.8 }}>PHQ-9得分</div>
          <div style={{ fontWeight: 800 }}>{phq9_score ?? "-"}</div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ opacity: 0.8 }}>风险等级</div>
          <div style={{ fontWeight: 800 }}>{risk_level}</div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", flex: 1 }}>
          <div style={{ opacity: 0.8 }}>标签</div>
          <div style={{ fontWeight: 800 }}>{tags?.join(", ") || "无"}</div>
        </div>
      </div>

      {risk_level === "高" && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(239,68,68,.15)" }}>
          <b>安全提示：</b>如有自伤/自杀想法或紧急风险，请及时联系校心理中心/家人朋友/120/110。
        </div>
      )}

      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
        <h3>建议卡片</h3>
        {report.recommendations.map((r, i) => (
          <div key={i} style={{ marginTop: 10, padding: 12, borderRadius: 12, background: "rgba(59,130,246,.10)" }}>
            <b>{r.title}</b>
            <div style={{ marginTop: 6, opacity: 0.9 }}>{r.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
        <h3>禁忌提示</h3>
        {report.contraindications.map((c, i) => (
          <div key={i} style={{ marginTop: 8 }}>
            <b>{c.title}</b>：{c.detail}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
        <h3>证据链（可解释路径）</h3>
        {report.evidence_paths.map((p, i) => (
          <div key={i} style={{ marginTop: 10, padding: 12, borderRadius: 12, background: "rgba(255,255,255,.06)" }}>
            <div><b>路径：</b>{p.path.join(" → ")}</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>
              来源：{p.source} ｜ 置信度：{p.confidence}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <Link to="/plan" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", textDecoration: "none" }}>
          去7天计划
        </Link>
        <Link to="/history" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", textDecoration: "none" }}>
          查看历史记录
        </Link>
        <Link to="/privacy" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", textDecoration: "none" }}>
          隐私与数据管理
        </Link>
      </div>
    </div>
  );
}