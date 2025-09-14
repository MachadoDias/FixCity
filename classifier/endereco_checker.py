import spacy # type: ignore
import os
import sys
import json

class AddressClassifier:
    def __init__(self, model_path="classifier/modelo_endereco"):
        """Inicializa o classificador de endereços"""
        self.model_path = model_path
        self.nlp = None
        self.load_model()
    
    def load_model(self):
        """Carrega o modelo treinado"""
        try:
            if os.path.exists(self.model_path):
                self.nlp = spacy.load(self.model_path)
                return True
            else:
                return False
        except Exception as e:
            return False
    
    def classify(self, text):
        """Classifica se o texto é um endereço"""
        if not self.nlp:
            return None
        
        doc = self.nlp(text)
        
        if doc.cats:
            best_category = max(doc.cats.items(), key=lambda x: x[1])
            category = best_category[0]
            confidence = best_category[1]
        else:
            category = "NOT_ADDRESS"
            confidence = 0.0
        
        return {
            "text": text,
            "category": category,
            "confidence": confidence,
            "all_scores": dict(doc.cats) if doc.cats else {}
        }
    
def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error" : "parametros nao fornecidos"}))
        return
    text = sys.argv[1]
    classifier = AddressClassifier()
    result = classifier.classify(text)
    if result and result["category"] == "IS_ADDRESS" and result["confidence"] >= 0.9:
        print(json.dumps(True))
    else:
        print(json.dumps(False))

if __name__ == "__main__":
    main()    