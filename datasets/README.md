# Dataset Preprocessing for ELEVARE

This directory contains scripts for preprocessing Kaggle datasets for career recommendations.

## Recommended Kaggle Datasets

### 1. Career Dataset
- **Dataset:** "Career Prediction Dataset"
- **URL:** https://www.kaggle.com/datasets/
- **Purpose:** Career titles, skills, salary information

### 2. Personality Dataset
- **Dataset:** "Big Five Personality Test"
- **URL:** https://www.kaggle.com/datasets/
- **Purpose:** Personality trait correlations

### 3. Emotion Detection Dataset
- **Dataset:** "Emotion Detection from Text"
- **URL:** https://www.kaggle.com/datasets/
- **Purpose:** Training emotion classification models

### 4. Skills-Career Mapping
- **Dataset:** "LinkedIn Job Postings"
- **URL:** https://www.kaggle.com/datasets/
- **Purpose:** Skills required for different careers

## Preprocessing Scripts

### career_preprocessor.py
```python
import pandas as pd
import json

def preprocess_career_data(input_csv):
    """
    Preprocess career dataset from Kaggle
    """
    df = pd.read_csv(input_csv)
    
    # Clean and transform data
    careers = []
    for _, row in df.iterrows():
        career = {
            "title": row['job_title'],
            "category": row['category'],
            "description": row['description'],
            "requiredTraits": {
                "analyticalThinking": row.get('analytical_score', 50),
                "creativity": row.get('creativity_score', 50),
                "communication": row.get('communication_score', 50),
                # Map other traits
            },
            "skills": row['skills'].split(',') if pd.notna(row['skills']) else [],
            "averageSalary": row.get('salary_range', 'Varies'),
            "growthRate": row.get('growth_outlook', 'Stable')
        }
        careers.append(career)
    
    return careers

def save_to_mongodb(careers):
    """
    Save preprocessed careers to MongoDB
    """
    from pymongo import MongoClient
    
    client = MongoClient('mongodb://localhost:27017/')
    db = client['elevare']
    
    # Clear existing data
    db.careers.delete_many({})
    
    # Insert new data
    db.careers.insert_many(careers)
    print(f"Inserted {len(careers)} careers into database")

if __name__ == "__main__":
    careers = preprocess_career_data('kaggle_careers.csv')
    save_to_mongodb(careers)
```

### personality_mapper.py
```python
import pandas as pd
import numpy as np

def map_personality_to_careers(personality_csv, career_csv):
    """
    Create personality-career compatibility matrix
    """
    personality_df = pd.read_csv(personality_csv)
    career_df = pd.read_csv(career_csv)
    
    # Statistical analysis to find correlations
    # between personality traits and career success
    
    compatibility_matrix = {}
    
    for career in career_df['job_title'].unique():
        career_data = personality_df[personality_df['career'] == career]
        
        compatibility_matrix[career] = {
            'openness': career_data['openness'].mean(),
            'conscientiousness': career_data['conscientiousness'].mean(),
            'extraversion': career_data['extraversion'].mean(),
            'agreeableness': career_data['agreeableness'].mean(),
            'neuroticism': career_data['neuroticism'].mean()
        }
    
    return compatibility_matrix
```

### emotion_trainer.py
```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
import pandas as pd

def train_emotion_model(dataset_path):
    """
    Fine-tune emotion detection model on custom dataset
    """
    df = pd.read_csv(dataset_path)
    
    # Prepare dataset
    texts = df['text'].tolist()
    labels = df['emotion'].tolist()
    
    # Load pre-trained model
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, 
        num_labels=7  # 7 emotions
    )
    
    # Training configuration
    training_args = TrainingArguments(
        output_dir='./models/emotion',
        num_train_epochs=3,
        per_device_train_batch_size=16,
        save_steps=1000,
        save_total_limit=2,
    )
    
    # Train model
    # trainer = Trainer(model=model, args=training_args, ...)
    # trainer.train()
    
    return model
```

## Usage Instructions

1. **Download Datasets:**
   ```bash
   # Install Kaggle CLI
   pip install kaggle
   
   # Download datasets
   kaggle datasets download -d <dataset-name>
   ```

2. **Preprocess Data:**
   ```bash
   python career_preprocessor.py
   python personality_mapper.py
   ```

3. **Load into MongoDB:**
   ```bash
   # Data is automatically loaded by preprocessing scripts
   # Or manually import using mongoimport
   mongoimport --db elevare --collection careers --file careers.json
   ```

## Data Schema Mapping

### From Kaggle CSV to MongoDB

**Input CSV:**
```
job_title,category,skills,salary_min,salary_max,growth_rate
Software Engineer,Technology,"Python,Java",90000,150000,22%
```

**Output MongoDB Document:**
```json
{
  "title": "Software Engineer",
  "category": "Technology",
  "skills": ["Python", "Java"],
  "averageSalary": "$90,000 - $150,000",
  "growthRate": "22%",
  "requiredTraits": {...},
  "personalityFit": {...}
}
```

## Notes

- The system includes a default career database in `ai-services/data/career_data.py`
- Kaggle datasets enhance the system with real-world data
- Preprocessing scripts should be run before production deployment
- Regular updates recommended as job market evolves
