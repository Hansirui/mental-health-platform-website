import { Link } from 'react-router-dom'

function InfoCard({ title, text, linkText, linkHref }) {
  const cardStyle = {
    backgroundColor: '#172554',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px'
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-6px)'
    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '14px', fontSize: '22px' }}>{title}</h3>
        <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '20px' }}>{text}</p>
      </div>

      {linkText && linkHref ? (
        <Link
          to={linkHref}
          style={{
            marginTop: '16px',
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '15px',
            alignSelf: 'flex-start'
          }}
        >
          {linkText}
        </Link>
      ) : linkText ? (
        <a
          href="#"
          style={{
            marginTop: '16px',
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '15px',
            alignSelf: 'flex-start'
          }}
        >
          {linkText}
        </a>
      ) : null}
    </div>
  )
}

export default InfoCard