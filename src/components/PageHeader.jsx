function PageHeader({ title, description }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>{title}</h1>

      <p
        style={{
          color: '#cbd5e1',
          fontSize: '18px',
          lineHeight: '1.8',
          maxWidth: '800px'
        }}
      >
        {description}
      </p>
    </div>
  )
}

export default PageHeader