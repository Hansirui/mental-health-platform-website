# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 抑郁症智能评估与辅助干预平台

一个基于 **React + Vite + React Router** 搭建的大创项目原型网站，面向大学生心理健康场景，展示问卷评估、文本分析、结果展示、个人中心和项目介绍等核心模块。

## 项目简介

本项目用于展示一个“抑郁症智能评估与辅助干预平台”的前端原型。  
当前版本以**网页展示与基础交互**为主，适合作为：

- 大创项目中期/结题展示
- 答辩演示原型
- 后续继续开发的前端基础框架

当前已经实现的内容包括：

- 首页展示页
- 核心功能介绍
- 评估体验入口
- 个人中心模块展示
- 关于项目模块展示
- 问卷评估页面
- 文本输入页面
- 结果展示页面
- 页面路由跳转
- 基础交互动效
- Footer 项目信息展示

---

## 技术栈

本项目目前使用的技术如下：

- **React**
- **Vite**
- **React Router DOM**
- **JavaScript**
- **CSS / 内联样式**

---

## 项目目标

本项目的设计目标主要有两个：

1. **快速搭建出可展示的网页原型**
2. **方便后期继续优化和扩展**

因此，当前版本采用了“先完成结构、再逐步增强功能”的思路，优先保证：

- 页面完整
- 结构清晰
- 模块可扩展
- 后续方便接接口、加后端、做优化

---

## 当前功能模块

### 1. 首页
首页用于展示项目整体定位，包括：

- 项目名称
- 项目简介
- 快捷按钮
- 功能模块入口
- 关于项目说明
- 页脚信息

### 2. 核心功能
首页展示了平台的四个主要功能方向：

- 问卷评估
- 文本分析
- 风险识别
- 趋势跟踪

### 3. 评估体验
首页可直接进入三个真实子页面：

- 问卷评估页
- 文本输入页
- 结果展示页

### 4. 个人中心
当前为展示型模块，包含：

- 我的报告
- 历史记录
- 趋势分析
- 账号设置

### 5. 关于项目
展示项目整体背景与价值，包括：

- 项目背景
- 研究目标
- 创新特色
- 应用价值

---

## 已完成页面

### 首页 `/`
展示项目整体信息与功能入口。

### 问卷评估页 `/questionnaire`
当前为可演示的问卷原型页面，已包含多道示例题目和选项按钮。

### 文本输入页 `/text-input`
当前为可演示的文本分析原型页面，包含：

- 文本输入框
- 提交按钮
- 分析结果预览

### 结果展示页 `/result`
当前为可演示的结果页面，包含：

- 评估得分
- 风险等级
- 关键词
- 辅助建议
- 趋势图占位区

---

## 项目结构

当前项目结构大致如下：

```bash
my-website/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ Footer.jsx
│  │  ├─ HeroSection.jsx
│  │  ├─ InfoCard.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ PageHeader.jsx
│  │  └─ SectionTitle.jsx
│  ├─ pages/
│  │  ├─ Questionnaire.jsx
│  │  ├─ ResultPage.jsx
│  │  └─ TextInput.jsx
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.jsx
├─ package.json
└─ README.md
