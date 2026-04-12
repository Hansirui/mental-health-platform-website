import pandas as pd
from pathlib import Path
import re

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "raw_data" / "DAIC-WOZ"
OUTPUT_ROOT = PROJECT_ROOT / "ml" / "processed_data"

TRAIN_SPLIT_FILE = DATA_ROOT / "train_split_Depression_AVEC2017.csv"
DEV_SPLIT_FILE = DATA_ROOT / "dev_split_Depression_AVEC2017.csv"

OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)


def read_csv_safe(path: Path, sep=None) -> pd.DataFrame:
    """
    通用读取函数：
    - 普通 csv 用默认逗号
    - transcript 用 tab 分隔
    """
    encodings = ["utf-8", "utf-8-sig", "gbk", "latin1"]

    for encoding in encodings:
        try:
            if sep is None:
                return pd.read_csv(path, encoding=encoding)
            else:
                return pd.read_csv(path, encoding=encoding, sep=sep)
        except Exception:
            continue

    raise ValueError(f"无法读取文件: {path}")


def clean_text(text: str) -> str:
    text = str(text)
    text = re.sub(r"\[(.*?)\]", " ", text)
    text = re.sub(r"<(.*?)>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_participant_text(transcript_path: Path) -> str:
    """
    transcript 实际上是 tab 分隔，不是普通 csv
    """
    df = read_csv_safe(transcript_path, sep="\t")

    required_cols = ["speaker", "value"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(
                f"{transcript_path} 缺少列 {col}，当前列名：{list(df.columns)}"
            )

    speaker_series = df["speaker"].astype(str).str.lower()

    # 优先只保留 participant 的发言
    participant_df = df[speaker_series.str.contains("participant", na=False)]

    # 如果没有 participant，就退而求其次：排除 ellie
    if len(participant_df) == 0:
        participant_df = df[~speaker_series.str.contains("ellie", na=False)]

    text_list = participant_df["value"].dropna().astype(str).tolist()
    text_list = [clean_text(t) for t in text_list if clean_text(t)]

    return " ".join(text_list)


def normalize_pid_column(df: pd.DataFrame) -> str:
    candidates = ["Participant_ID", "participant_ID", "participant_id"]
    for col in candidates:
        if col in df.columns:
            return col
    raise ValueError(f"没找到 participant id 列，当前列名：{list(df.columns)}")


def build_one_split(split_file: Path, split_name: str) -> pd.DataFrame:
    split_df = read_csv_safe(split_file)

    pid_col = normalize_pid_column(split_df)

    required_cols = [pid_col, "PHQ8_Binary", "PHQ8_Score"]
    for col in required_cols:
        if col not in split_df.columns:
            raise ValueError(f"{split_file} 缺少必要列 {col}，当前列名：{list(split_df.columns)}")

    rows = []
    skipped = []

    for _, row in split_df.iterrows():
        pid = int(row[pid_col])
        transcript_path = DATA_ROOT / f"{pid}_P" / f"{pid}_TRANSCRIPT.csv"

        if not transcript_path.exists():
            skipped.append(pid)
            continue

        try:
            text = extract_participant_text(transcript_path)
        except Exception as e:
            print(f"[WARN] 处理 participant {pid} 失败: {e}")
            skipped.append(pid)
            continue

        if not text:
            skipped.append(pid)
            continue

        item = {
            "participant_id": pid,
            "split": split_name,
            "text": text,
            "phq8_binary": int(row["PHQ8_Binary"]),
            "phq8_score": int(row["PHQ8_Score"]),
        }

        if "Gender" in split_df.columns:
            item["gender"] = row["Gender"]

        rows.append(item)

    result_df = pd.DataFrame(rows)

    print(f"\n===== {split_name.upper()} 构建完成 =====")
    print(f"成功样本数: {len(result_df)}")
    print(f"跳过样本数: {len(skipped)}")
    if skipped:
        print(f"跳过示例: {skipped[:10]}")

    return result_df


def main():
    print("===== 开始构建文本数据集（当前只使用 train + dev）=====")

    train_df = build_one_split(TRAIN_SPLIT_FILE, "train")
    dev_df = build_one_split(DEV_SPLIT_FILE, "dev")

    full_df = pd.concat([train_df, dev_df], ignore_index=True)

    full_df.to_csv(OUTPUT_ROOT / "text_dataset_full.csv", index=False, encoding="utf-8-sig")
    train_df.to_csv(OUTPUT_ROOT / "train.csv", index=False, encoding="utf-8-sig")
    dev_df.to_csv(OUTPUT_ROOT / "dev.csv", index=False, encoding="utf-8-sig")

    print("\n===== 导出完成 =====")
    print(f"full: {len(full_df)}")
    print(f"train: {len(train_df)}")
    print(f"dev: {len(dev_df)}")
    print(f"文件输出目录: {OUTPUT_ROOT}")


if __name__ == "__main__":
    main()