import { useEffect, useState } from "react";

export default function AuthModal({ open, mode, onClose, onSubmit }) {
  // mode: "login" | "register"
  const [tab, setTab] = useState(mode || "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // ✅ 关键：每次打开/切换模式时，同步到当前 tab
  useEffect(() => {
    if (open) {
      setTab(mode || "login");
      setErr("");
      // 你也可以选择每次打开都清空输入
      // setUsername("");
      // setPassword("");
    }
  }, [mode, open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await onSubmit({ mode: tab, username, password });
      onClose();
    } catch (ex) {
      setErr(ex?.message || "操作失败");
    }
  };

  const tabBtnStyle = (active) => ({
    flex: 1,
    padding: "8px 10px",
    borderRadius: 10,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,.1)",
    background: active ? "#1c64f2" : "transparent",
    color: "#fff",
    fontWeight: 600,
  });

  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.12)",
    background: "#0f1a2f",
    color: "#fff",
    outline: "none",
  };

  const primaryBtn = {
    marginTop: 14,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#1c64f2",
    color: "#fff",
    fontWeight: 700,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 390,
          borderRadius: 12,
          background: "#0b1220",
          color: "#fff",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
          overflow: "hidden",
        }}
      >
        {/* 顶部 */}
        <div
          style={{
            padding: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div style={{ fontWeight: 800 }}>{tab === "login" ? "登录" : "注册"}</div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
            aria-label="close"
            title="关闭"
          >
            ×
          </button>
        </div>

        {/* Tab */}
        <div style={{ display: "flex", gap: 8, padding: "12px 14px 0" }}>
          <button type="button" onClick={() => setTab("login")} style={tabBtnStyle(tab === "login")}>
            登录
          </button>
          <button type="button" onClick={() => setTab("register")} style={tabBtnStyle(tab === "register")}>
            注册
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={submit} style={{ padding: "12px 14px 14px" }}>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.85 }}>用户名</div>
            <input value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.85 }}>密码（Demo 版不会真实校验）</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {err && <div style={{ color: "#ff6b6b", marginTop: 10, fontSize: 12 }}>{err}</div>}

          <button type="submit" style={primaryBtn}>
            {tab === "login" ? "登录" : "注册"}
          </button>
        </form>

        {/* 底部提示 */}
        <div style={{ padding: "0 14px 14px", fontSize: 12, opacity: 0.75 }}>
          说明：这是前端 Demo 登录态（localStorage），答辩够用；后续接后端再替换。
        </div>
      </div>
    </div>
  );
}