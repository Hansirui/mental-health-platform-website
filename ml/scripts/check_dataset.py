import pandas as pd
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "raw_data" / "DAIC-WOZ"

TRAIN_SPLIT_FILE = DATA_ROOT / "train_split_Depression_AVEC2017.csv"
DEV_SPLIT_FILE = DATA_ROOT / "dev_split_Depression_AVEC2017.csv"
TEST_SPLIT_FILE = DATA_ROOT / "test_split_Depression_AVEC2017.csv"


def read_csv_safe(path: Path) -> pd.DataFrame:
    for encoding in ["utf-8", "utf-8-sig", "gbk", "latin1"]:
        try:
            return pd.read_csv(path, encoding=encoding)
        except Exception:
            continue
    raise ValueError(f"无法读取文件: {path}")


def find_pid_column(df: pd.DataFrame) -> str:
    candidates = [
        "Participant_ID",
        "participant_ID",
        "participant_id",
        "Participant",
        "participant",
        "ID",
        "id",
    ]
    for col in df.columns:
        if col in candidates:
            return col

    for col in df.columns:
        if "participant" in col.lower():
            return col

    raise ValueError(f"没找到 participant 列，当前列名：{list(df.columns)}")


def normalize_participant_ids(df: pd.DataFrame) -> list[int]:
    pid_col = find_pid_column(df)
    series = pd.to_numeric(df[pid_col], errors="coerce").dropna().astype(int)
    return sorted(series.unique().tolist())


def check_one_split(split_name: str, split_df: pd.DataFrame):
    participant_ids = normalize_participant_ids(split_df)

    missing_dirs = []
    missing_transcripts = []
    available = []

    for pid in participant_ids:
        participant_dir = DATA_ROOT / f"{pid}_P"
        transcript_file = participant_dir / f"{pid}_TRANSCRIPT.csv"

        dir_exists = participant_dir.exists() and participant_dir.is_dir()
        transcript_exists = transcript_file.exists()

        if not dir_exists:
            missing_dirs.append(pid)
        if dir_exists and not transcript_exists:
            missing_transcripts.append(pid)

        if dir_exists and transcript_exists:
            available.append(pid)

    print(f"\n===== {split_name.upper()} =====")
    print(f"{split_name} participant 数量: {len(participant_ids)}")
    print(f"可用样本数量: {len(available)}")
    print(f"缺失目录数量: {len(missing_dirs)}")
    if missing_dirs:
        print(f"缺失目录示例: {missing_dirs[:10]}")
    print(f"缺失 transcript 数量: {len(missing_transcripts)}")
    if missing_transcripts:
        print(f"缺失 transcript 示例: {missing_transcripts[:10]}")

    return {
        "split": split_name,
        "available_ids": available,
        "missing_dirs": missing_dirs,
        "missing_transcripts": missing_transcripts,
    }


def main():
    print("===== 开始检查数据集 =====")
    print(f"PROJECT_ROOT: {PROJECT_ROOT}")
    print(f"DATA_ROOT: {DATA_ROOT}")

    required_files = [
        TRAIN_SPLIT_FILE,
        DEV_SPLIT_FILE,
        TEST_SPLIT_FILE,
    ]

    print("\n===== 检查关键文件 =====")
    for file_path in required_files:
        print(f"{file_path} -> {file_path.exists()}")
        if not file_path.exists():
            raise FileNotFoundError(f"缺少文件: {file_path}")

    train_df = read_csv_safe(TRAIN_SPLIT_FILE)
    dev_df = read_csv_safe(DEV_SPLIT_FILE)
    test_df = read_csv_safe(TEST_SPLIT_FILE)

    print("\n===== SPLIT 文件列名 =====")
    print("train:", list(train_df.columns))
    print("dev  :", list(dev_df.columns))
    print("test :", list(test_df.columns))

    train_result = check_one_split("train", train_df)
    dev_result = check_one_split("dev", dev_df)
    test_result = check_one_split("test", test_df)

    print("\n===== 标签情况说明 =====")
    print(f"train 是否有 PHQ8_Binary: {'PHQ8_Binary' in train_df.columns}")
    print(f"dev   是否有 PHQ8_Binary: {'PHQ8_Binary' in dev_df.columns}")
    print(f"test  是否有 PHQ8_Binary: {'PHQ8_Binary' in test_df.columns}")

    print("\n===== 当前建议 =====")
    print("1. 当前 baseline 用 train 训练、dev 验证")
    print("2. test 因为没有标签，先不参与监督评估")
    print("3. 后面构建文本数据集时，只先导出 train.csv 和 dev.csv")

    print("\n===== 总结 =====")
    print(f"可用于训练的 train 样本数: {len(train_result['available_ids'])}")
    print(f"可用于验证的 dev 样本数 : {len(dev_result['available_ids'])}")
    print(f"可用于推理的 test 样本数: {len(test_result['available_ids'])}")


if __name__ == "__main__":
    main()