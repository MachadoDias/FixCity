import spacy
import os

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
        
        # Encontra a categoria com maior score
        best_category = max(doc.cats.items(), key=lambda x: x[1])
        
        # Extrai entidades
        entities = []
        for ent in doc.ents:
            entities.append({
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char
            })
        
        return {
            "text": text,
            "category": best_category[0],
            "confidence": best_category[1],
            "all_scores": dict(doc.cats),
            "entities": entities
        }
    
    def classify_batch(self, texts):
        """Classifica múltiplos textos"""
        results = []
        for text in texts:
            result = self.classify(text)
            if result:
                results.append(result)
        return results

def main():
    """Função principal para teste"""
    classifier = DemandClassifier()
    
    # Testes
    test_texts = [
       "tamo na escuridao aqui na rua"
    ]
    
    print("=== TESTE DO CLASSIFICADOR ===\n")
    
    for text in test_texts:
        result = classifier.classify(text)
        if result:
            print(f"Texto: {result['text']}")
            print(f"Categoria: {result['category']} (confiança: {result['confidence']:.3f})")
            print(f"Todos os scores: {result['all_scores']}")
            if result['entities']:
                print("Entidades encontradas:")
                for ent in result['entities']:
                    print(f"  - {ent['text']} ({ent['label']})")
            print("-" * 50)
        else:
            print(f"Erro ao classificar: {text}")
            print("-" * 50)

if __name__ == "__main__":
    main()