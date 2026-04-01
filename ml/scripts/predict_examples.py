from pathlib import Path
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "processed_data"
OUTPUT_ROOT = PROJECT_ROOT / "ml" / "outputs"
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

train_df = pd.read_csv(DATA_ROOT / "train.csv")
dev_df = pd.read_csv(DATA_ROOT / "dev.csv")

X_train = train_df["text"].astype(str).tolist()
y_train = train_df["phq8_binary"].astype(int).tolist()

X_dev = dev_df["text"].astype(str).tolist()
y_dev = dev_df["phq8_binary"].astype(int).tolist()

vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=1
)

X_train_vec = vectorizer.fit_transform(X_train)

model = LogisticRegression(max_iter=1000, class_weight="balanced")
model.fit(X_train_vec, y_train)

X_dev_vec = vectorizer.transform(X_dev)
dev_pred = model.predict(X_dev_vec)

sample_df = dev_df.copy()
sample_df["predicted_label"] = dev_pred
sample_df["is_correct"] = (sample_df["phq8_binary"] == sample_df["predicted_label"]).astype(int)

sample_df["text_preview"] = sample_df["text"].astype(str).apply(
    lambda x: x[:200] + "..." if len(x) > 200 else x
)

show_df = sample_df[[
    "participant_id",
    "phq8_binary",
    "phq8_score",
    "predicted_label",
    "is_correct",
    "text_preview"
]].head(5)

print(show_df.to_string(index=False))

show_df.to_csv(OUTPUT_ROOT / "example_predictions_clean.csv", index=False, encoding="utf-8-sig")
print("\n已保存到:", OUTPUT_ROOT / "example_predictions_clean.csv")