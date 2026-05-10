# ATLAS VEX Custom AI Model Training

This directory contains configurations and scripts for training a custom AI model for Atlas Vex.

## Cloudflare Workers AI Limitations

Cloudflare Workers AI provides access to pre-trained models but does not currently support custom model training. However, you can:

1. **Fine-tune existing models** using external services
2. **Use custom prompts** for personality adaptation
3. **Implement prompt engineering** for specialized responses
4. **Combine multiple models** for different tasks

## Current Implementation

The Atlas Vex AI uses:
- **Base Model**: Meta Llama 3.1 8B Instruct
- **Customization**: System prompt engineering
- **Personality**: Cyberpunk AI assistant persona
- **Context**: Conversation history awareness

## Future Custom Model Options

### 1. Fine-tuning with External Services

#### Using Hugging Face
```python
# Example fine-tuning script (to be run externally)
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
import torch

model_name = "meta-llama/Llama-3.1-8B"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Custom dataset for Atlas Vex personality
train_dataset = [
    {"input": "Hello", "output": "Greetings, operator. Atlas Vex online..."},
    {"input": "Who are you?", "output": "I am Atlas Vex, autonomous co-pilot for Alan Marvel..."},
    # ... more training examples
]

# Fine-tuning configuration
training_args = TrainingArguments(
    output_dir="./atlas-vex-model",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=500,
    logging_steps=100,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)

trainer.train()
```

#### Using OpenAI Fine-tuning
```python
import openai

# Upload training data
openai.File.create(
    file=open("atlas_vex_training.jsonl"),
    purpose="fine-tune"
)

# Start fine-tuning job
openai.FineTune.create(
    training_file=file_id,
    model="gpt-3.5-turbo",
    suffix="atlas-vex-v1"
)
```

### 2. Custom Model Deployment

Once fine-tuned, you can deploy to:
- **Cloudflare Workers AI** (if supported in future)
- **Hugging Face Inference API**
- **Replicate**
- **Together AI**
- **Custom GPU instance**

### 3. Hybrid Approach

Combine multiple models for different capabilities:

```javascript
// Worker implementation with model routing
async function routeToModel(message, context) {
  if (message.includes("technical") || message.includes("code")) {
    return await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });
  } else if (message.includes("creative") || message.includes("design")) {
    return await env.AI.run('@cf/blackforestlabs/flux-1-schnell', { prompt: message });
  } else {
    return await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });
  }
}
```

## Training Data Collection

### Current Data Sources
- System prompt with personality definition
- Conversation logs from user interactions
- Portfolio content and project descriptions
- Technical documentation

### Data Augmentation
```python
# Example data augmentation script
def augment_training_data(base_examples):
    augmented = []

    for example in base_examples:
        # Add variations
        augmented.append(example)
        augmented.append({
            "input": example["input"].lower(),
            "output": example["output"]
        })
        augmented.append({
            "input": f"Can you {example['input'].lower()}?",
            "output": example["output"]
        })

    return augmented
```

## Model Evaluation

### Metrics to Track
- Response relevance
- Personality consistency
- Technical accuracy
- Response time
- User satisfaction

### Evaluation Script
```python
def evaluate_model(model, test_cases):
    scores = []

    for test_case in test_cases:
        response = model.generate(test_case["input"])
        score = evaluate_response(response, test_case["expected"])
        scores.append(score)

    return sum(scores) / len(scores)
```

## Deployment Strategy

1. **A/B Testing**: Deploy new model alongside existing
2. **Gradual Rollout**: Start with percentage of users
3. **Fallback**: Keep old model as backup
4. **Monitoring**: Track performance metrics
5. **Rollback**: Ability to revert quickly

## Cost Optimization

- **Caching**: Cache frequent responses
- **Prompt Optimization**: Minimize token usage
- **Batch Processing**: Group similar requests
- **Model Selection**: Choose appropriate model size

## Security Considerations

- **Input Validation**: Sanitize all inputs
- **Output Filtering**: Prevent harmful content
- **Rate Limiting**: Prevent abuse
- **Logging**: Monitor for suspicious activity
- **Data Privacy**: Handle user data appropriately