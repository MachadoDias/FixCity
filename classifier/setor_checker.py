import spacy # type: ignore
import os
import sys
import json

class DemandClassifier:
    def __init__(self, model_path="classifier/modelo_setor"):
        """Inicializa o classificador"""
        self.model_path = model_path
        self.nlp = None
        self.load_model()
    
    def load_model(self):
        """Carrega o modelo treinado"""
        try:
            if os.path.exists(self.model_path):
                self.nlp = spacy.load(self.model_path)
            else:
                return False
        except Exception as e:
            return False
        return True
    
    def classify(self, text):
        """Classifica um texto"""
        if not self.nlp:
            return None
        
        doc = self.nlp(text)
        
        # Verifica se tem categorias
        if doc.cats:
            best_category = max(doc.cats.items(), key=lambda x: x[1])
            category = best_category[0]
            confidence = best_category[1]
        else:
            category = "SEM_CATEGORIA"
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
    classifier = DemandClassifier()
    result = classifier.classify(text)
    if result and result.category == sys.argv[2]:
        print(json.dumps(True))
    else:
        print(json.dumps(False))

if __name__ == "__main__":
    main()