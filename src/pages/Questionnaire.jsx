import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function Questionnaire() {
  const questions = [
    '过去两周，你是否经常感到情绪低落？',
    '过去两周，你是否对做事情失去兴趣或乐趣？',
    '过去两周，你是否经常感到疲惫、精力不足？',
    '过去两周，你是否存在睡眠困难或睡眠过多的情况？',
    '过去两周，你是否觉得自己压力很大、难以放松？'
  ]

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
          title="问卷评估页面"
          description="这里后续可以放 PHQ-9 问卷、选项评分、提交按钮和评估结果。当前先展示一个可演示的问卷原型页面。"
        />

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {questions.map((question, index) => (
            <div
              key={index}
              style={{
                marginTop: '24px',
                backgroundColor: '#172554',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <h3 style={{ marginTop: 0 }}>题目 {index + 1}</h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8' }}>{question}</p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <button style={buttonStyle}>没有</button>
                <button style={buttonStyle}>几天</button>
                <button style={buttonStyle}>一半以上时间</button>
                <button style={buttonStyle}>几乎每天</button>
              </div>
            </div>
          ))}

          <button
            style={{
              marginTop: '30px',
              padding: '14px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            提交问卷
          </button>

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

const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
}

export default Questionnaire