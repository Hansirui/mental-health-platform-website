import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function ResultPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '60px 24px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto'
        }}
      >
        <PageHeader
          title="结果展示页面"
          description="这里后续可以放评估得分、风险等级、关键词分析、辅助建议和趋势信息。当前先展示一个可演示的结果原型页面。"
        />

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div
            style={{
              marginTop: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}
          >
            <div style={cardStyle}>
              <h3>评估得分</h3>
              <p style={textStyle}>PHQ-9 示例得分：14 分</p>
            </div>

            <div style={cardStyle}>
              <h3>风险等级</h3>
              <p style={textStyle}>当前结果：中度风险</p>
            </div>

            <div style={cardStyle}>
              <h3>关键词</h3>
              <p style={textStyle}>失眠、压力大、兴趣减退</p>
            </div>
          </div>

          <div
            style={{
              marginTop: '24px',
              backgroundColor: '#172554',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <h3>辅助建议</h3>
            <p style={textStyle}>
              建议保持规律作息，记录近期情绪波动，适当进行运动与社交；如持续低落，建议寻求专业帮助。
            </p>
          </div>

          <div
            style={{
              marginTop: '24px',
              backgroundColor: '#172554',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <h3>趋势图占位区</h3>
            <p style={{ ...textStyle, marginBottom: '20px' }}>
              这里后续可以接入情绪趋势、风险变化趋势和阶段性评估记录。
            </p>

            <div
              style={{
                height: '220px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px dashed rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '16px'
              }}
            >
              趋势图预留区域
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                color: '#60a5fa',
                textDecoration: 'none'
              }}
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  backgroundColor: '#172554',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)'
}

const textStyle = {
  color: '#cbd5e1',
  lineHeight: '1.8'
}

export default ResultPage