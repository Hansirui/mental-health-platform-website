import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { getUser, setUser, clearUser } from "../utils/authStorage";

function Navbar() {
  const [user, setUserState] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    setUserState(getUser());
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  const handleAuth = async ({ mode, username, password }) => {
    if (!username || !password) throw new Error("请输入用户名和密码");
    // Demo：直接当作成功（后续接后端再换这里）
    const u = { username };
    setUser(u);            // 写入 localStorage
    setUserState(u);       // 更新页面显示
  };

  const logout = () => {
    clearUser();
    setUserState(null);
  };

  // 复用你现有按钮样式
  const ghostBtn = {
    padding: '10px 18px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid #475569',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const primaryBtn = {
    padding: '10px 18px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    border: 'none'
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        backgroundColor: '#0f172a',
        zIndex: 1000
      }}
    >
      <h2 style={{ margin: 0 }}>大创项目平台</h2>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>首页</a>
        <a href="#features" style={{ color: 'white', textDecoration: 'none' }}>功能介绍</a>
        <a href="#experience" style={{ color: 'white', textDecoration: 'none' }}>评估体验</a>
        <a href="#profile" style={{ color: 'white', textDecoration: 'none' }}>个人中心</a>
        <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>关于项目</a>

        {/* ✅ 新增：登录/注册 或 用户/退出（放在右侧按钮区） */}
        {!user ? (
          <>
            <button onClick={openLogin} style={ghostBtn}>登录</button>
            <button onClick={openRegister} style={ghostBtn}>注册</button>
          </>
        ) : (
          <>
            <span style={{ color: "white", opacity: 0.9 }}>你好，{user.username}</span>
            <button onClick={logout} style={ghostBtn}>退出</button>
          </>
        )}

        <Link to="/result" style={ghostBtn}>
          查看结果
        </Link>

        <a href="#experience" style={primaryBtn}>
          立即体验
        </a>
      </div>

      {/* ✅ 新增：弹窗组件（必须渲染出来才会显示） */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSubmit={handleAuth}
      />
    </div>
  )
}

export default Navbar