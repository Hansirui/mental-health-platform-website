import { Link } from 'react-router-dom'

function InfoCard({ title, text, linkText, linkHref }) {
  const cardStyle = {
    backgroundColor: '#1e2f6d',
    borderRadius: '20px',
    padding: '30px',
    minHeight: '260px',
    height: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.08) inset',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: linkHref ? 'pointer' : 'default',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }

  const content = (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.28)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.08) inset'
      }}
    >
      <div>
        <h3
          style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            marginTop: 0,
            marginBottom: '20px'
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: '#dbeafe',
            fontSize: '18px',
            lineHeight: '1.8',
            margin: 0
          }}
        >
          {text}
        </p>
      </div>

      {linkText && (
        <div
          style={{
            marginTop: '24px',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '10px 16px',
            borderRadius: '10px',
            display: 'inline-block',
            alignSelf: 'flex-start'
          }}
        >
          {linkText}
        </div>
      )}
    </div>
  )

  if (linkHref) {
    return (
      <Link
        to={linkHref}
        style={{
          textDecoration: 'none',
          display: 'block',
          height: '100%'
        }}
      >
        {content}
      </Link>
    )
  }

  return content
}

export default InfoCard