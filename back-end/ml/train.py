import pandas as pd
import joblib
import os
from sentence_transformers import SentenceTransformer
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder

def train_and_save():
    # 1. Setup paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'data/grocery_dataset.csv')
    models_dir = os.path.join(base_dir, 'models')
    
    # Create models directory if it doesn't exist
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        print(f"Created directory: {models_dir}")

    # 2. Load dataset
    if not os.path.isfile(data_path):
        print(f"Error: Data file not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} products from CSV.")

    # 3. Initialize Encoder
    # Using a multilingual model that handles Hebrew perfectly
    print("Loading transformer model and encoding text...")
    encoder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    
    # Convert product names to vectors (Embeddings)
    X = encoder.encode(df['product_name'].tolist())

    # 4. Encode labels
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(df['category'])

    # 5. Train Classifier (SVM)
    print("Training SVM classifier...")
    clf = SVC(kernel='linear', probability=True)
    clf.fit(X, y)

    # 6. Save assets
    clf_path = os.path.join(models_dir, 'classifier.joblib')
    labels_path = os.path.join(models_dir, 'labels.joblib')

    joblib.dump(clf, clf_path)
    joblib.dump(label_encoder, labels_path)

    print("-" * 30)
    print(f"Success! Model assets saved in: {models_dir}")
    print(f"Classes found: {list(label_encoder.classes_)}")
    print("-" * 30)

if __name__ == "__main__":
    train_and_save()