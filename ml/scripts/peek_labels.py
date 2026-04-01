import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "raw_data" / "DAIC-WOZ"

labels_file = DATA_ROOT / "AVEC2017_Labels.csv"
df = pd.read_csv(labels_file)

print("列名：")
print(list(df.columns))
print("\n前10行：")
print(df.head(10))