import spacy
from spacy.training import Example
import json
import os

def load_data(file_path):
    """Carrega dados do arquivo JSONL"""
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line.strip()))
    return data

def train_model():
    """Treina o modelo usando spaCy"""
    
    # Carrega dados
    train_data = load_data('classifier/data/textcat_clean.jsonl')
    
    # Cria modelo em branco
    nlp = spacy.blank("pt")
    
    # Adiciona componentes
    textcat = nlp.add_pipe("textcat_multilabel")
    
    # Adiciona labels
    labels = ["obras", "saude", "iluminacao", "limpeza"]
    for label in labels:
        textcat.add_label(label)
    
    # Prepara exemplos de treino
    examples = []
    for item in train_data:
        doc = nlp.make_doc(item["text"])
        
        # Prepara categorias
        cats = item.get("cats", {})
        
        example = Example.from_dict(doc, {"cats": cats})
        examples.append(example)
    
    # Inicializa o modelo
    nlp.initialize(lambda: examples)
    
    # Treina
    print("Iniciando treinamento...")
    for i in range(10):  # 10 épocas
        losses = {}
        nlp.update(examples, losses=losses)
        print(f"Época {i+1}, Perdas: {losses}")
    
    # Salva modelo
    output_dir = "classifier/modelo_setor"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    nlp.to_disk(output_dir)
    print(f"Modelo salvo em {output_dir}")

if __name__ == "__main__":
    train_model()