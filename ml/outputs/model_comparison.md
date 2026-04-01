# Model Comparison

## Dataset

- train samples: 67
- dev samples: 16

## Results

| Model | Accuracy | Precision | Recall | F1 |

|---|---:|---:|---:|---:|
| TF-IDF + Logistic Regression | 0.6875 | 0.7000 | 0.7778 | 0.7368 |
| TF-IDF + Linear SVM | 0.6875 | 0.7500 | 0.6667 | 0.7059 |

## Current Conclusion

At the current stage, TF-IDF + Logistic Regression is the better baseline because it achieves higher recall and F1 score on the dev set.