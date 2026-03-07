function HeroSection() {
  return (
    <div
      id="home"
      style={{
        paddingTop: '72px',
        paddingBottom: '72px',
        paddingLeft: '40px',
        paddingRight: '40px'
      }}
    >
      <h1 style={{ fontSize: '56px', marginBottom: '20px' }}>
        智能评估与辅助干预平台（本地修改37）
      </h1>

      <p style={{ fontSize: '20px', color: '#cbd5e1', marginBottom: '16px' }}>
        面向大学生心理健康场景的智能评估与辅助干预系统
      </p>

      <p
        style={{
          fontSize: '18px',
          color: '#94a3b8',
          maxWidth: '800px',
          lineHeight: '1.8'
        }}
      >
        支持问卷评估、文本分析、风险识别、趋势跟踪和辅助建议展示，
        适合作为大创项目官网和系统原型的基础版本。
      </p>

      <div style={{ marginTop: '30px', display: 'flex', gap: '16px' }}>
        <a
          href="#experience"
          style={{
            padding: '14px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '10px',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          开始体验
        </a>

        <a
          href="#features"
          style={{
            padding: '14px 24px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '10px',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          查看功能
        </a>
      </div>
    </div>
  )
}

export default HeroSection