import { Link } from 'react-router-dom'

function Navbar() {
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
        <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>
          首页
        </a>
        <a href="#features" style={{ color: 'white', textDecoration: 'none' }}>
          功能介绍
        </a>
        <a href="#experience" style={{ color: 'white', textDecoration: 'none' }}>
          评估体验
        </a>
        <a href="#profile" style={{ color: 'white', textDecoration: 'none' }}>
          个人中心
        </a>
        <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>
          关于项目
        </a>

        <Link
          to="/result"
          style={{
            padding: '10px 18px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          查看结果
        </Link>

        <a
          href="#experience"
          style={{
            padding: '10px 18px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          立即体验
        </a>
      </div>
    </div>
  )
}

export default Navbar