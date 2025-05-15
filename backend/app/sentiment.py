import torch
import pandas as pd
import numpy as np
from collections import Counter
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer

# Select the correct device (MPS if available)
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

########new
device = "mps" if torch.backends.mps.is_available() else "cpu"


class SimpleDataset:
    def __init__(self, tokenized_texts):
        self.tokenized_texts = tokenized_texts
    
    def __len__(self):
        return len(self.tokenized_texts["input_ids"])
    
    def __getitem__(self, idx):
        return {k: v[idx] for k, v in self.tokenized_texts.items()}

# loads tokenizer and model, creates trainer
model_name = "j-hartmann/emotion-english-distilroberta-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name).to(device)
trainer = Trainer(model=model)

def analyze_sentiment(texts):
    """
    Analyze sentiment for a list of texts.
    
    :param texts: List of texts to analyze.
    :return: DataFrame with sentiment analysis results.
    """
    # tokenizes texts and creates prediction dataset
    tokenized_texts = tokenizer(texts, truncation=True, padding=True, return_tensors="pt")

    # move tensors to the MPS device
    for key in tokenized_texts:
        tokenized_texts[key] = tokenized_texts[key].to(device)

    pred_dataset = SimpleDataset(tokenized_texts)

    predictions = trainer.predict(pred_dataset)

    # Finds the index of the maximum value (i.e. the most likely emotion) and then maps it to its emotion name
    preds = predictions.predictions.argmax(-1)
    labels = pd.Series(preds).map(model.config.id2label)

    temp = (np.exp(predictions[0]) / np.exp(predictions[0]).sum(-1, keepdims=True))

    emotion_labels = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]
    max_emotion_counts = {emotion: 0 for emotion in emotion_labels}
    formatted_results = []

    for i in range(len(texts)):
        scores = {emotion_labels[j]: float(temp[i][j]) for j in range(len(emotion_labels))}

        
        max_emotion = max(scores, key=scores.get)
        max_emotion_counts[max_emotion] += 1 

        # stores the text, its numerical score for each emotion, and then the dominant emotion 
        formatted_results.append({
            "text": texts[i],  
            **scores,
            "max_emotion": max_emotion 
        })

    return {"results": formatted_results, "max_emotion_counts": dict(max_emotion_counts)}



