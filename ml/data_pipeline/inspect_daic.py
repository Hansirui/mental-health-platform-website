from pathlib import Path
import pandas as pd

# 你的完整数据集根目录
DATA_ROOT = Path(r"D:\project\datasets\avec 2017")

# 猜测的几个常见位置
candidate_transcript_paths = [
    DATA_ROOT / "DAIC-WOZ" / "300_P" / "300_TRANSCRIPT.csv",
    DATA_ROOT / "300_P" / "300_TRANSCRIPT.csv",
]

candidate_label_paths = [
    DATA_ROOT / "AVEC2017_Labels.csv",
    DATA_ROOT / "DAIC-WOZ" / "AVEC2017_Labels.csv",
]

print("=== 检查 transcript 文件 ===")
transcript_path = None
for p in candidate_transcript_paths:
    print("尝试路径：", p)
    if p.exists():
        transcript_path = p
        break

if transcript_path is None:
    print("没有找到 transcript 文件，请检查目录结构。")
else:
    print("找到 transcript：", transcript_path)
    df = pd.read_csv(transcript_path)
    print("列名：", list(df.columns))
    print("前5行：")
    print(df.head())

    if "speaker" in df.columns:
        print("speaker 唯一值：", df["speaker"].dropna().unique().tolist())

print("\n=== 检查 labels 文件 ===")
labels_path = None
for p in candidate_label_paths:
    print("尝试路径：", p)
    if p.exists():
        labels_path = p
        break

if labels_path is None:
    print("没有找到 AVEC2017_Labels.csv，请检查目录结构。")
else:
    print("找到 labels：", labels_path)
    labels_df = pd.read_csv(labels_path)
    print("列名：", list(labels_df.columns))
    print("前5行：")
    print(labels_df.head())