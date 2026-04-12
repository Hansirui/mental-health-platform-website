# 文本 baseline 流程图文字稿

原始 transcript 数据
↓
提取 participant 发言
↓
与 train/dev split 标签对齐
↓
构建 train.csv / dev.csv
↓
文本向量化（TF-IDF）
↓
分类模型（LR / SVM）
↓
输出抑郁风险预测结果
↓
结果评估（Accuracy / Precision / Recall / F1）