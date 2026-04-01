import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "raw_data" / "DAIC-WOZ"

sample_file = DATA_ROOT / "300_P" / "300_TRANSCRIPT.csv"
df = pd.read_csv(sample_file)

print("列名：")
print(list(df.columns))
print("\n前10行：")
print(df.head(10))