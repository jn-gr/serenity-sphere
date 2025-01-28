import torch
from transformers import RobertaTokenizerFast, RobertaForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset
from sklearn.metrics import f1_score, accuracy_score

def compute_metrics(pred):
    """Compute multi-label metrics at a threshold of 0.5."""
    logits = pred.predictions
    labels = pred.label_ids

    # Convert logits to probabilities
    probs = torch.sigmoid(torch.tensor(logits))
    # Round by threshold=0.5
    y_preds = (probs >= 0.5).int().numpy()

    micro_f1 = f1_score(labels, y_preds, average="micro", zero_division=0)
    macro_f1 = f1_score(labels, y_preds, average="macro", zero_division=0)
    subset_acc = accuracy_score(labels, y_preds)

    return {
        "micro_f1": micro_f1,
        "macro_f1": macro_f1,
        "subset_accuracy": subset_acc
    }

def main():
    # 1. Load GoEmotions dataset
    dataset = load_dataset("go_emotions")

    # 2. Convert list-of-labels (e.g. [0,10]) to a float multi-hot vector of size 28
    def to_multi_hot(batch):
        multi_hot = []
        for label_list in batch["labels"]:
            vec = [0.0]*28  # float zero
            for lbl in label_list:
                vec[lbl] = 1.0  # float one
            multi_hot.append(vec)
        return {"ml_labels": multi_hot}

    dataset = dataset.map(to_multi_hot, batched=True)

    # Remove the original "labels" column so no collision
    dataset = dataset.remove_columns(["labels"])

    # Rename "ml_labels" -> "labels"
    dataset = dataset.rename_column("ml_labels", "labels")

    # 3. Tokenize text
    tokenizer = RobertaTokenizerFast.from_pretrained("roberta-base")

    def tokenize_function(batch):
        return tokenizer(batch["text"], padding="max_length", truncation=True, max_length=128)

    dataset = dataset.map(tokenize_function, batched=True)

    # 4. Set format for training
    dataset.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

    # 5. Load RoBERTa for multi-label
    model = RobertaForSequenceClassification.from_pretrained(
        "roberta-base",
        num_labels=28,
        problem_type="multi_label_classification"
    )

    # 6. Training arguments
    training_args = TrainingArguments(
        output_dir="./results_multilabel",
        evaluation_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=3,
        weight_decay=0.01,
        logging_steps=100,
        logging_dir="./logs_multilabel"
    )

    # 7. Create Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["validation"],
        compute_metrics=compute_metrics
    )

    # 8. Train
    trainer.train()


    # 9. Evaluate
    result = trainer.evaluate(dataset["test"])
    print("Test set evaluation:", result)

    # 10. Save
    model.save_pretrained("../models/roberta_model_multilabel")
    tokenizer.save_pretrained("../models/roberta_model_multilabel")
    print("Saved multi-label RoBERTa to ../models/roberta_model_multilabel")

if __name__ == "__main__":
    main()
