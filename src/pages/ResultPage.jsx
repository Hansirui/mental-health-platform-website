import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getLatestRecord, getRecord, logAction } from "../utils/storage";

export default function ResultPage() {
  const [sp] = useSearchParams();
  const id = sp.get("id");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sourceText, setSourceText] = useState("正在加载后端数据...");

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const url = id
          ? `http://127.0.0.1:5051/records/${encodeURIComponent(id)}`
          : "http://127.0.0.1:5051/records/latest";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch backend record");
        }

        const data = await response.json();
        setRecord(data);
        setSourceText(id ? "当前显示：后端单条记录" : "当前显示：后端最近记录");
      } catch (error) {
        console.error("Failed to load backend result, fallback to localStorage:", error);

        const localRecord = id ? getRecord(id) : getLatestRecord();
        setRecord(localRecord);
        setSourceText("当前显示：本地记录（联调回退模式）");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
    logAction("view_result", { id: id || "latest" });
  }, [id]);

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

  const infoCardStyle = {
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(255,255,255,.05)",
    minWidth: 150,
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

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, color: "#f8fafc" }}>
          结果展示
        </h2>
        <div style={cardStyle}>
          <p style={{ color: "#cbd5e1" }}>正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={pageStyle}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, color: "#f8fafc" }}>
          结果展示
        </h2>

        <div style={cardStyle}>
          <p style={{ color: "#cbd5e1", marginBottom: 14 }}>
            暂无记录，请先完成问卷评估或文本输入。
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Link to="/" style={linkBtnStyle}>返回首页</Link>
          <Link to="/questionnaire" style={linkBtnStyle}>去问卷评估</Link>
          <Link to="/text-input" style={linkBtnStyle}>去文本输入</Link>
        </div>
      </div>
    );
  }

  const { phq9_score, risk_level, tags, report, created_at, type, baseline_result, text } = record;

  return (
    <div style={pageStyle}>
      <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, color: "#f8fafc" }}>
        结果报告
      </h2>

      <div
        style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 12,
          background: "rgba(250,204,21,.12)",
          border: "1px solid rgba(250,204,21,.28)",
          color: "#fde68a",
          lineHeight: 1.8,
          fontSize: 15,
        }}
      >
        本系统仅用于初筛与建议，不替代专业诊断。
      </div>

      <p style={{ color: "#94a3b8", marginBottom: 18 }}>
        {sourceText}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>来源</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>{type}</div>
        </div>

        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>时间</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>
            {created_at ? new Date(created_at).toLocaleString() : "-"}
          </div>
        </div>

        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>PHQ-9得分</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>{phq9_score ?? "-"}</div>
        </div>

        <div style={infoCardStyle}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>风险等级</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>{risk_level}</div>
        </div>

        <div style={{ ...infoCardStyle, flex: 1 }}>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>标签</div>
          <div style={{ fontWeight: 800, color: "#f8fafc" }}>{tags?.join(", ") || "无"}</div>
        </div>
      </div>

      {baseline_result && (
        <div style={{ ...cardStyle, marginTop: 18 }}>
          <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>文本模型结果</h3>
          <div style={{ color: "#cbd5e1", lineHeight: 1.9 }}>
            <div><b style={{ color: "#f8fafc" }}>模型名称：</b>{baseline_result.model_name || "-"}</div>
            <div><b style={{ color: "#f8fafc" }}>预测标签：</b>{baseline_result.predicted_label ?? "-"}</div>
            <div><b style={{ color: "#f8fafc" }}>模型风险等级：</b>{baseline_result.risk_level || "-"}</div>
          </div>
        </div>
      )}

      {text && (
        <div style={{ ...cardStyle, marginTop: 18 }}>
          <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>输入文本</h3>
          <div style={{ color: "#cbd5e1", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
            {text}
          </div>
        </div>
      )}

      {risk_level === "高风险" && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            background: "rgba(239,68,68,.18)",
            border: "1px solid rgba(248,113,113,.28)",
            color: "#fee2e2",
            lineHeight: 1.8,
          }}
        >
          <b>高风险提示：</b>
          当前结果提示你可能处于需要重点关注的状态。本系统仅提供初筛与建议，
          不可替代专业诊断。若已出现持续绝望、自伤、自杀想法或明显功能受损，
          请尽快联系学校心理中心、家人朋友或专业医疗机构，必要时拨打 120 / 110。
        </div>
      )}

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>建议卡片</h3>
        {report?.recommendations?.length ? (
          report.recommendations.map((r, i) => (
            <div
              key={i}
              style={{
                marginTop: 10,
                padding: 14,
                borderRadius: 12,
                background: "rgba(59,130,246,.10)",
                border: "1px solid rgba(96,165,250,.18)",
                color: "#e2e8f0",
              }}
            >
              <b style={{ color: "#f8fafc" }}>{r.title}</b>
              <div style={{ marginTop: 6, color: "#cbd5e1", lineHeight: 1.7 }}>{r.detail}</div>
            </div>
          ))
        ) : (
          <div style={{ color: "#cbd5e1" }}>暂无建议内容</div>
        )}
      </div>

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>禁忌提示</h3>
        {report?.contraindications?.length ? (
          report.contraindications.map((c, i) => (
            <div key={i} style={{ marginTop: 10, color: "#cbd5e1", lineHeight: 1.7 }}>
              <b style={{ color: "#f8fafc" }}>{c.title}</b>：{c.detail}
            </div>
          ))
        ) : (
          <div style={{ color: "#cbd5e1" }}>暂无禁忌提示</div>
        )}
      </div>

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h3 style={{ fontSize: 28, marginBottom: 16, color: "#f8fafc" }}>证据链（可解释路径）</h3>
        {report?.evidence_paths?.length ? (
          report.evidence_paths.map((p, i) => (
            <div
              key={i}
              style={{
                marginTop: 10,
                padding: 14,
                borderRadius: 12,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(148,163,184,.18)",
                color: "#e2e8f0",
              }}
            >
              <div style={{ lineHeight: 1.7 }}>
                <b style={{ color: "#f8fafc" }}>路径：</b>{p.path.join(" → ")}
              </div>
              <div style={{ marginTop: 6, color: "#94a3b8" }}>
                来源：{p.source} ｜ 置信度：{p.confidence}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "#cbd5e1" }}>暂无证据链内容</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Link to="/" style={linkBtnStyle}>返回首页</Link>
        <Link to="/plan" style={linkBtnStyle}>去7天计划</Link>
        <Link to="/history" style={linkBtnStyle}>查看历史记录</Link>
        <Link to="/privacy" style={linkBtnStyle}>隐私与数据管理</Link>
      </div>
    </div>
  );
}