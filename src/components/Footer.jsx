function Footer() {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '30px 40px',
        backgroundColor: '#0b1220'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '40px',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>大创项目平台</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8', maxWidth: '360px' }}>
            面向大学生心理健康场景的智能评估与辅助干预系统原型网站。
          </p>
        </div>

        <div>
          <h4 style={{ marginTop: 0 }}>团队信息</h4>
          <p style={{ color: '#94a3b8' }}>学校：合肥工业大学</p>
          <p style={{ color: '#94a3b8' }}>团队：龙琪琪 大创项目团队</p>
        </div>

        <div>
          <h4 style={{ marginTop: 0 }}>联系方式</h4>
          <p style={{ color: '#94a3b8' }}>邮箱：3180166277@qq.com</p>
          <p style={{ color: '#94a3b8' }}>指导老师：郑淑丽</p>
        </div>
      </div>

      <div style={{ marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
        © 2026 大创项目平台. All Rights Reserved.
      </div>
    </div>
  )
}

export default Footer