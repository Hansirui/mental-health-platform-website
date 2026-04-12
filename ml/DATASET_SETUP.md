# 数据集配置说明

本项目不直接在 GitHub 仓库中提供完整原始数据集。

## 1. 原始数据集

当前文本实验使用的数据集为本地目录中的 AVEC 2017 / DAIC-WOZ 数据。

例如本地路径：

D:\project\datasets\avec 2017

## 2. 不上传的数据

以下内容不上传到 GitHub：

- 原始 transcript / audio / video 数据
- processed_data
- checkpoints
- outputs
- 本地测试 db.json

## 3. 运行前需要准备

请在本地准备好数据集目录，并保证包含：

- AVEC2017_Labels.csv
- 各 participant 目录，例如 300_P、301_P ...
- 对应 transcript 文件，例如 300_TRANSCRIPT.csv

## 4. 数据路径配置

当前脚本中的 DATA_ROOT 默认指向本地路径。  
如需更换路径，请修改脚本中的 DATA_ROOT，或使用环境变量。

示例：

DAIC_DATA_ROOT=D:\project\datasets\avec 2017

## 5. 数据处理顺序

按以下顺序运行：

1. inspect_daic.py
2. build_daic_text_dataset.py
3. split_daic_dataset.py
4. train_tfidf_lr_daic.py
5. export_test_predictions_daic.py
6. tune_threshold_daic.py
7. evaluate_test_with_threshold_daic.py