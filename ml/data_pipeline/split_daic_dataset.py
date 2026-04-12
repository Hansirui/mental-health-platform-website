from pathlib import Path
import pandas as pd

DATA_ROOT = Path(r"D:\project\datasets\avec 2017")
PROCESSED_ROOT = Path("ml/processed_data")
PROCESSED_ROOT.mkdir(parents=True, exist_ok=True)

TEXT_DATASET_PATH = PROCESSED_ROOT / "daic_text_dataset.csv"

TRAIN_SPLIT_PATH = DATA_ROOT / "train_split_Depression_AVEC2017.csv"
DEV_SPLIT_PATH = DATA_ROOT / "dev_split_Depression_AVEC2017.csv"
TEST_SPLIT_PATH = DATA_ROOT / "full_test_split.csv"

# ===== 读取主数据集 =====
df = pd.read_csv(TEXT_DATASET_PATH)

# participant_id 统一成 int
df["participant_id"] = df["participant_id"].astype(int)

def load_split_ids(path: Path, split_name: str):
    split_df = pd.read_csv(path)
    print(f"\n=== {split_name} split 列名 ===")
    print(list(split_df.columns))
    print(split_df.head())

    # 自动找第一列作为 id 列
    id_col = split_df.columns[0]
    ids = split_df[id_col].dropna().astype(int).tolist()
    return ids

train_ids = load_split_ids(TRAIN_SPLIT_PATH, "train")
dev_ids = load_split_ids(DEV_SPLIT_PATH, "dev")
test_ids = load_split_ids(TEST_SPLIT_PATH, "test")

train_df = df[df["participant_id"].isin(train_ids)].copy()
dev_df = df[df["participant_id"].isin(dev_ids)].copy()
test_df = df[df["participant_id"].isin(test_ids)].copy()

# 加 split 字段
train_df["split"] = "train"
dev_df["split"] = "dev"
test_df["split"] = "test"

# 输出
train_out = PROCESSED_ROOT / "train.csv"
dev_out = PROCESSED_ROOT / "dev.csv"
test_out = PROCESSED_ROOT / "test.csv"

train_df.to_csv(train_out, index=False, encoding="utf-8-sig")
dev_df.to_csv(dev_out, index=False, encoding="utf-8-sig")
test_df.to_csv(test_out, index=False, encoding="utf-8-sig")

print("\n===== 切分完成 =====")
print(f"train: {len(train_df)} -> {train_out}")
print(f"dev:   {len(dev_df)} -> {dev_out}")
print(f"test:  {len(test_df)} -> {test_out}")

print("\ntrain 预览：")
print(train_df.head())

print("\ndev 预览：")
print(dev_df.head())

print("\ntest 预览：")
print(test_df.head())