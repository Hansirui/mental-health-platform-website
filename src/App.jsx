import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SectionTitle from './components/SectionTitle'
import InfoCard from './components/InfoCard'
import HeroSection from './components/HeroSection'
import Questionnaire from './pages/Questionnaire'
import TextInput from './pages/TextInput'
import ResultPage from './pages/ResultPage'
import PlanPage from "./pages/PlanPage";
import HistoryPage from "./pages/HistoryPage";
import PrivacyPage from "./pages/PrivacyPage";
import TrendPage from "./pages/TrendPage";
import GraphPage from "./pages/GraphPage";

function HomePage() {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        color: 'white'
      }}
    >
      <Navbar />

      <HeroSection />

      <div id="features" style={{ padding: '0 40px 80px 40px' }}>
        <SectionTitle title="核心功能" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
        >
          <InfoCard
            title="问卷评估"
            text="提供基础心理问卷入口，用于初步评估用户心理状态。"
            linkText="进入问卷评估"
            linkHref="/questionnaire"
          />
          <InfoCard
            title="文本分析"
            text="支持用户输入文本内容，进行情绪倾向和关键词分析。"
            linkText="进入文本输入"
            linkHref="/text-input"
          />
          <InfoCard
            title="风险识别"
            text="根据评估结果生成风险等级，帮助识别重点关注对象。"
            linkText="查看结果报告"
            linkHref="/result"
          />
          <InfoCard
            title="趋势跟踪"
            text="展示历史评估记录与趋势变化，便于后续持续观察。"
            linkText="查看历史记录"
            linkHref="/history"
          />
        </div>
      </div>

      <div id="experience" style={{ padding: '0 40px 80px 40px' }}>
        <SectionTitle title="评估体验" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          <InfoCard
            title="问卷评估"
            text="用户可进入基础心理问卷页面，完成初步状态评估。"
            linkText="进入问卷"
            linkHref="/questionnaire"
          />
          <InfoCard
            title="文本输入"
            text="用户可输入近期情绪、睡眠、压力等文字信息，进行内容分析。"
            linkText="开始输入"
            linkHref="/text-input"
          />
          <InfoCard
            title="结果展示"
            text="展示评估得分、风险等级、关键词和辅助建议等内容。"
            linkText="查看结果"
            linkHref="/result"
          />
        </div>
      </div>

      <div id="profile" style={{ padding: '0 40px 80px 40px' }}>
        <SectionTitle title="个人中心" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
        >
          <InfoCard
            title="我的报告"
            text="查看个人历史评估报告、结果摘要和辅助建议内容。"
            linkText="查看我的报告"
            linkHref="/result"
          />
          <InfoCard
            title="历史记录"
            text="展示过往评估时间、输入记录和阶段性结果信息。"
            linkText="进入历史记录"
            linkHref="/history"
          />
          <InfoCard
            title="趋势分析"
            text="用于展示情绪变化趋势、风险等级变化和阶段对比。"
            linkText="查看趋势记录"
            linkHref="/trend"
          />
          <InfoCard
            title="账号设置"
            text="用户可管理个人资料、提醒设置和基础账户信息。"
            linkText="进入隐私与设置"
            linkHref="/privacy"
          />
        </div>
      </div>

      <div id="about" style={{ padding: '0 40px 100px 40px' }}>
        <SectionTitle title="关于项目" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
        >
          <InfoCard
            title="项目背景"
            text="聚焦大学生心理健康问题，构建更便捷的智能化辅助评估平台。"
            linkText="查看首页"
            linkHref="/"
          />
          <InfoCard
            title="研究目标"
            text="实现问卷、文本等多维信息融合，提升评估与干预展示能力。"
            linkText="进入问卷评估"
            linkHref="/questionnaire"
          />
          <InfoCard
            title="创新特色"
            text="结合智能分析、风险识别和趋势追踪，形成完整原型展示链路。"
            linkText="查看知识图谱"
            linkHref="/graph"
          />
          <InfoCard
            title="应用价值"
            text="可服务于校园心理健康场景，也适合作为大创项目成果展示平台。"
            linkText="查看隐私与管理"
            linkHref="/privacy"
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/text-input" element={<TextInput />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App