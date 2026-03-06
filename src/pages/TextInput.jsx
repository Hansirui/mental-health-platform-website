import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function TextInput() {
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
          title="文本输入页面"
          description="这里后续可以放用户情绪描述输入框、关键词分析结果和情绪倾向判断。当前先展示一个可演示的文本分析原型页面。"
        />

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              marginTop: '30px',
              backgroundColor: '#172554',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <h3>请输入你的近期状态</h3>

            <textarea
              placeholder="例如：最近总觉得压力很大，晚上睡不太好，对很多事情提不起兴趣……"
              style={{
                width: '100%',
                minHeight: '180px',
                marginTop: '16px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: '#0f172a',
                color: 'white',
                fontSize: '16px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            <button
              style={{
                marginTop: '20px',
                padding: '12px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              提交分析
            </button>
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
            <h3>分析结果预览</h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginTop: '16px'
              }}
            >
              <div style={smallCardStyle}>
                <h4 style={{ marginTop: 0 }}>情绪倾向</h4>
                <p style={textStyle}>中度低落</p>
              </div>

              <div style={smallCardStyle}>
                <h4 style={{ marginTop: 0 }}>关键词</h4>
                <p style={textStyle}>压力大、失眠、疲惫</p>
              </div>

              <div style={smallCardStyle}>
                <h4 style={{ marginTop: 0 }}>风险提示</h4>
                <p style={textStyle}>建议持续关注近期状态变化</p>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <h4 style={{ marginTop: 0 }}>辅助建议</h4>
              <p style={textStyle}>
                建议保持规律作息，减少熬夜，适当记录每日情绪状态；如近期持续存在明显低落、无助或睡眠问题，可进一步结合问卷结果进行综合评估。
              </p>
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

const smallCardStyle = {
  backgroundColor: '#0f172a',
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.08)'
}

const textStyle = {
  color: '#cbd5e1',
  lineHeight: '1.8'
}

export default TextInput