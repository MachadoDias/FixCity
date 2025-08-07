import spacy
from spacy.training import Example
import json
import os

def load_data(file_path):
    """Carrega dados do arquivo JSONL"""
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line.strip()))
    return data

def train_model():
    """Treina o modelo com dados expandidos"""
    
    # Carrega dados limpos
    train_data = load_data('classifier/data/train_clean.jsonl')
    
    # Cria modelo em branco
    nlp = spacy.blank("pt")
    
    # Adiciona componentes
    ner = nlp.add_pipe("ner")
    textcat = nlp.add_pipe("textcat_multilabel")
    
    # Adiciona labels
    labels = ["obras", "saude", "iluminacao", "limpeza"]
    for label in labels:
        textcat.add_label(label)
    
    # Adiciona entidades
    ner_labels = ["NOME", "ENDERECO"]
    for label in ner_labels:
        ner.add_label(label)
    
    # Prepara exemplos de treino
    examples = []
    for item in train_data:
        doc = nlp.make_doc(item["text"])
        
        # Prepara categorias
        cats = item.get("cats", {})
        
        # Prepara entidades
        entities = []
        if "entities" in item:
            for start, end, label in item["entities"]:
                entities.append((start, end, label))
        
        example = Example.from_dict(doc, {"cats": cats, "entities": entities})
        examples.append(example)
    
    # Inicializa o modelo
    nlp.initialize(lambda: examples)
    
    # Treina com mais épocas
    print("Iniciando treinamento com dados expandidos...")
    for i in range(20):  # 20 épocas
        losses = {}
        nlp.update(examples, losses=losses)
        if i % 5 == 0:
            print(f"Época {i+1}, Perdas: NER={losses.get('ner', 0):.2f}, TextCat={losses.get('textcat_multilabel', 0):.4f}")
    
    # Salva modelo
    output_dir = "classifier/model"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    nlp.to_disk(output_dir)
    print(f"Modelo retreinado salvo em {output_dir}")

if __name__ == "__main__":
    train_model()