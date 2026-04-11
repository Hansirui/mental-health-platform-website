# 当前项目进展记录

## 1. 当前系统功能

目前已经完成的前端与后端主线功能包括：

- 首页展示
- 问卷评估（PHQ-9）
- 文本评估
- 问卷 + 文本联合评估
- 结果报告页
- 历史记录页
- 趋势分析页
- 7天计划入口
- 隐私与数据管理入口

## 2. 当前后端主线

当前后端已统一为 Flask 服务，Express 不再作为主线使用。

当前核心接口包括：

- `GET /`
- `POST /assessment`
- `GET /records`
- `POST /records`
- `GET /records/latest`
- `GET /records/<id>`
- `POST /predict_text`（保留）

其中：

- `/assessment` 作为统一评估接口
- 问卷评估、文本评估、联合评估都通过 `/assessment` 返回统一结构
- 历史页和趋势页通过 `/records` 读取后端记录

## 3. 当前评估逻辑

### 问卷评估

- 基于 PHQ-9 计算得分
- 根据分数生成风险等级

### 文本评估

- 当前网页中文文本评估主要依赖：
  - 中文关键词规则
  - 文本线索提取
  - 风险合并逻辑
  - 高风险表达兜底

### 联合评估

- 当用户同时提交问卷与文本时
- 后端会统一生成：
  - `phq9_score`
  - `risk_level`
  - `symptom_signals`
  - `explanations`
  - `recommendations`
  - `warnings`
  - `report`

## 4. 当前页面说明

### 结果页

结果页当前展示内容包括：

- 来源
- 时间
- PHQ-9得分
- 风险等级
- 标签
- 识别到的关键状态
- 判断依据
- 实验模型结果
- 输入文本
- 建议卡片
- 禁忌提示
- 证据链
- 高风险提示

其中“实验模型结果”已明确标注：
> 当前实验模型基于英文访谈数据训练，对中文输入结果仅供参考。

### 历史页

已完成：

- 后端记录读取
- 本地回退
- 查看报告
- 导出 JSON
- 清空记录
- 操作留痕展示

### 趋势页

已完成：

- 后端记录读取
- 本地回退
- 最近记录数
- 最近一次类型
- 最近一次风险
- 最近一次 PHQ-9
- 分数变化摘要
- 风险变化摘要
- 最近几次评估列表展示

## 5. 当前数据处理进展

### DAIC-WOZ / AVEC2017 数据处理

已经完成：

- transcript 路径读取
- transcript 文本提取
- Participant 发言筛选
- 文本拼接
- 文本基础清洗
- 数据集总表生成
- train / dev / test 切分

已生成文件：

- `ml/processed_data/daic_text_dataset.csv`
- `ml/processed_data/train.csv`
- `ml/processed_data/dev.csv`
- `ml/processed_data/test.csv`

## 6. 当前模型进展

已完成：

- 使用 DAIC-WOZ 英文文本数据训练 TF-IDF + Logistic Regression
- 生成模型文件：
  - `ml/checkpoints/tfidf_vectorizer_daic.pkl`
  - `ml/checkpoints/tfidf_lr_model_daic.pkl`
- 生成评估指标文件：
  - `ml/outputs/tfidf_lr_daic_metrics.json`
- 生成测试集预测导出文件：
  - `ml/outputs/test_predictions_daic.csv`
  - `ml/outputs/test_predictions_daic_threshold_040.csv`

## 7. 当前模型结论

### 英文实验模型

当前英文实验模型已经成功完成：

- 数据提取
- 训练
- 评估
- 接回 Flask

但当前模型存在以下限制：

- 训练数据来自英文访谈文本
- 网页实际输入以中文为主
- 因此英文模型不适合直接作为中文网页主判断逻辑
- 当前网页中的“实验模型结果”仅用于实验展示与技术路线证明

### 中文网页主逻辑

当前中文网页主逻辑主要依赖：

- PHQ-9
- 中文关键词规则
- 规则化风险合并
- 高风险安全提示

## 8. 当前存在的问题

当前仍存在的主要问题包括：

1. 部分 transcript 文件读取失败
2. 个别 transcript 文件缺失
3. 英文模型对中文输入不适配
4. test 集表现仍一般
5. 尚未接入中文心理健康文本数据集
6. 尚未训练中文文本模型

## 9. 当前系统定位

当前系统定位为：

> 面向心理健康初筛与建议反馈的可运行原型系统。

强调：

- 只做初筛与建议
- 不替代专业诊断
- 问卷与文本结合
- 输出可解释结果
- 支持历史记录与趋势跟踪
- 实验模型部分作为后续研究与迭代基础

## 10. 下一步计划

接下来优先级建议如下：

### 第一优先级

- 固定当前版本
- 保证演示稳定
- 完成完整链路自测

### 第二优先级

- 接入中文心理健康文本数据
- 统一中文数据格式
- 训练中文文本模型

### 第三优先级

- 继续优化数据清洗
- 分析误判样本
- 迭代风险规则与模型融合逻辑
  