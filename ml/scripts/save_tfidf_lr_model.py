from pathlib import Path
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = PROJECT_ROOT / "ml" / "processed_data"
CHECKPOINT_DIR = PROJECT_ROOT / "ml" / "checkpoints"
CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)

train_df = pd.read_csv(DATA_ROOT / "train.csv")

X_train = train_df["text"].astype(str).tolist()
y_train = train_df["phq8_binary"].astype(int).tolist()

vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=1
)

X_train_vec = vectorizer.fit_transform(X_train)

model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model.fit(X_train_vec, y_train)

vectorizer_path = CHECKPOINT_DIR / "tfidf_vectorizer.pkl"
model_path = CHECKPOINT_DIR / "tfidf_lr_model.pkl"

joblib.dump(vectorizer, vectorizer_path)
joblib.dump(model, model_path)

print("保存完成：")
print("vectorizer ->", vectorizer_path)
print("model      ->", model_path)