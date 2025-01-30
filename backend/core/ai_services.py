import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import os

# Define the relative path to the model
model_path = '../models/roberta_model_multilabel_selftrained/'

# Verify that the model path exists
if not os.path.exists(model_path):
    raise FileNotFoundError(f"The specified model path does not exist: {os.path.abspath(model_path)}")

# Load the tokenizer and model
tokenizer = RobertaTokenizer.from_pretrained(model_path)
model = RobertaForSequenceClassification.from_pretrained(model_path)
model.eval()  # Set the model to evaluation mode

# emotion labels from the model card

EMOTION_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval", 
    "caring", "confusion", "curiosity", "desire", "disappointment", 
    "disapproval", "disgust", "embarrassment", "excitement", "fear", 
    "gratitude", "grief", "joy", "love", "nervousness", 
    "optimism", "pride", "realization", "relief", "remorse", 
    "sadness", "surprise", "neutral"
]

def predict_emotions(text, threshold=0.1):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits[0]
    probs = torch.sigmoid(logits).tolist()
    
    # Return all emotion labels above threshold
    results = []
    for label, p in zip(EMOTION_LABELS, probs):
        if p >= threshold:
            results.append((label, float(p)))
    
    return results
