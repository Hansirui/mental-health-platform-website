import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "processed_data"
OUTPUT_ROOT = PROJECT_ROOT / "ml" / "outputs"
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

train_df = pd.read_csv(DATA_ROOT / "train.csv")
dev_df = pd.read_csv(DATA_ROOT / "dev.csv")
full_df = pd.read_csv(DATA_ROOT / "text_dataset_full.csv")

for df in [train_df, dev_df, full_df]:
    df["text_length"] = df["text"].astype(str).apply(lambda x: len(x.split()))

stats = []
stats.append(f"full 样本数: {len(full_df)}")
stats.append(f"train 样本数: {len(train_df)}")
stats.append(f"dev 样本数: {len(dev_df)}")
stats.append("")
stats.append("train 标签分布:")
stats.append(str(train_df["phq8_binary"].value_counts(dropna=False)))
stats.append("")
stats.append("dev 标签分布:")
stats.append(str(dev_df["phq8_binary"].value_counts(dropna=False)))
stats.append("")
stats.append("文本长度统计（full）:")
stats.append(str(full_df["text_length"].describe()))

output_file = OUTPUT_ROOT / "dataset_stats.txt"
with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(stats))

print("\n".join(stats))
print(f"\n已保存到: {output_file}")