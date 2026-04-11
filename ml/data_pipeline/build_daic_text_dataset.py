from pathlib import Path
import pandas as pd
import re

# ===== 路径配置 =====
DATA_ROOT = Path(r"D:\project\datasets\avec 2017")
OUTPUT_DIR = Path("ml/processed_data")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 如果你的数据实际在 DAIC-WOZ 子目录里，就改成 DATA_ROOT / "DAIC-WOZ"
TRANSCRIPT_ROOT = DATA_ROOT
LABEL_PATH = DATA_ROOT / "AVEC2017_Labels.csv"

# ===== 读取标签 =====
labels_df = pd.read_csv(LABEL_PATH)

labels_df = labels_df.rename(columns={
    "file": "participant_id",
    "label": "label_score"
})

# 先按 >=10 作为二分类阈值
labels_df["label_binary"] = labels_df["label_score"].apply(lambda x: 1 if int(x) >= 10 else 0)

records = []
skip_count = 0


def clean_text(text: str) -> str:
    text = str(text).lower()

    # 去掉类似 <laughter> <sigh> <sync> 这类标记
    text = re.sub(r"<[^>]+>", " ", text)

    # 去掉多余符号，只保留字母、数字、空格、单引号
    text = re.sub(r"[^a-z0-9\s']", " ", text)

    # 多个空格压缩成一个
    text = re.sub(r"\s+", " ", text).strip()

    return text


def safe_read_transcript(path: Path):
    """
    依次尝试多种编码读取 transcript
    """
    encodings = ["utf-8", "utf-8-sig", "gbk", "latin1"]
    last_error = None

    for enc in encodings:
        try:
            return pd.read_csv(path, sep="\t", encoding=enc)
        except Exception as e:
            last_error = e

    raise last_error


for _, row in labels_df.iterrows():
    participant_id = int(row["participant_id"])
    label_score = int(row["label_score"])
    label_binary = int(row["label_binary"])

    folder_name = f"{participant_id}_P"
    transcript_name = f"{participant_id}_TRANSCRIPT.csv"
    transcript_path = TRANSCRIPT_ROOT / folder_name / transcript_name

    if not transcript_path.exists():
        print(f"[跳过] 找不到 transcript: {transcript_path}")
        skip_count += 1
        continue

    try:
        df = safe_read_transcript(transcript_path)
    except Exception as e:
        print(f"[跳过] 读取失败 {transcript_path}: {e}")
        skip_count += 1
        continue

    required_cols = {"speaker", "value"}
    if not required_cols.issubset(df.columns):
        print(f"[跳过] 缺少列 {transcript_path}，现有列：{list(df.columns)}")
        skip_count += 1
        continue

    # 只保留 Participant 发言
    participant_df = df[df["speaker"].astype(str).str.strip().eq("Participant")].copy()

    if participant_df.empty:
        print(f"[跳过] Participant 文本为空: {participant_id}")
        skip_count += 1
        continue

    # 清理文本列
    participant_df["value"] = participant_df["value"].fillna("").astype(str)
    participant_df["value"] = participant_df["value"].apply(clean_text)

    # 去掉空串、nan、none
    participant_df = participant_df[
        (participant_df["value"] != "") &
        (participant_df["value"].str.lower() != "nan") &
        (participant_df["value"].str.lower() != "none")
    ]

    # 过滤太短的片段
    participant_df = participant_df[participant_df["value"].str.len() >= 5]

    if participant_df.empty:
        print(f"[跳过] 清洗后 Participant 文本为空: {participant_id}")
        skip_count += 1
        continue

    full_text = " ".join(participant_df["value"].tolist()).strip()

    records.append({
        "participant_id": participant_id,
        "text": full_text,
        "label_score": label_score,
        "label_binary": label_binary,
        "source": "daic_woz",
    })

output_df = pd.DataFrame(records)

if not output_df.empty:
    output_df = output_df.sort_values("participant_id").reset_index(drop=True)

output_path = OUTPUT_DIR / "daic_text_dataset.csv"
output_df.to_csv(output_path, index=False, encoding="utf-8-sig")

print("\n===== 生成完成 =====")
print(f"输出文件: {output_path}")
print(f"成功样本数: {len(output_df)}")
print(f"跳过样本数: {skip_count}")

if not output_df.empty:
    print("\n前5行预览：")
    print(output_df.head())