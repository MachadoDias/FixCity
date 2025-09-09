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
        
        # Verifica se tem categorias
        if doc.cats:
            best_category = max(doc.cats.items(), key=lambda x: x[1])
            category = best_category[0]
            confidence = best_category[1]
        else:
            category = "SEM_CATEGORIA"
            confidence = 0.0
        
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
            "category": category,
            "confidence": confidence,
            "all_scores": dict(doc.cats) if doc.cats else {},
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

def classify_address_simple(text):
    """Classificação simples de endereços usando regras"""
    text_lower = text.lower()
    
    # Palavras que indicam endereço
    address_keywords = [
        'rua', 'avenida', 'alameda', 'travessa', 'praça', 'largo', 'estrada', 'rodovia',
        'av.', 'r.', 'al.', 'tv.', 'pç.', 'lg.', 'est.', 'rod.',
        'número', 'numero', 'nº', 'n°', ','
    ]
    
    # Verifica se tem palavras de endereço
    has_address_words = any(keyword in text_lower for keyword in address_keywords)
    
    # Verifica se tem números (possível numeração)
    has_numbers = any(char.isdigit() for char in text)
    
    # Verifica se não são apenas cumprimentos/conversas
    greeting_words = ['bom dia', 'boa tarde', 'boa noite', 'olá', 'oi', 'como vai', 'tudo bem', 'obrigado']
    is_greeting = any(greeting in text_lower for greeting in greeting_words)
    
    if is_greeting:
        return {'category': 'NOT_ADDRESS', 'confidence': 0.9}
    
    if has_address_words and has_numbers:
        return {'category': 'IS_ADDRESS', 'confidence': 0.8}
    elif has_address_words:
        return {'category': 'IS_ADDRESS', 'confidence': 0.6}
    else:
        return {'category': 'NOT_ADDRESS', 'confidence': 0.7}

def main():
    """Função principal para teste"""
    
    print("=== TESTE DOS CLASSIFICADORES ===\n")
    
    # Teste setor/demanda
    print("1. TESTE SETOR/DEMANDA:")
    # Ajusta caminho se executando de dentro da pasta classifier
    model_path = "modelo_setor" if os.path.exists("modelo_setor") else "classifier/modelo_setor"
    classifier_setor = DemandClassifier(model_path)
    
    if not classifier_setor.nlp:
        print("❌ ERRO: Modelo não carregou!")
        print("Verificando modelos disponíveis:")
        # Verifica na pasta atual e na pasta classifier
        for base_path in [".", "classifier"]:
            if os.path.exists(base_path):
                for item in os.listdir(base_path):
                    full_path = f"{base_path}/{item}" if base_path != "." else item
                    if os.path.isdir(full_path) and item.startswith("modelo"):
                        print(f"  - {full_path}")
        return
    else:
        print("✅ Modelo carregado com sucesso")
    
    test_demands = [
        "tamo na escuridao aqui na rua",
        "o asfalto da rua está todo quebrado",
        "tem um buraco gigante na calçada",
        "a iluminação pública não funciona",
        "preciso de ajuda com documentos"
    ]
    
    for text_setor in test_demands:
        result = classifier_setor.classify(text_setor)
        if result:
            print(f"Texto: {result['text']}")
            print(f"Categoria: {result['category']} ({result['confidence']:.3f})")
            print(f"Scores: {result['all_scores']}")
            print("-" * 30)
        else:
            print(f"❌ Falha ao classificar: {text_setor}")
            print("-" * 30)
    
    print("\n" + "-" * 50 + "\n")
    
    # Teste endereço (classificação simples)
    print("2. TESTE ENDEREÇO (CLASSIFICAÇÃO SIMPLES):")
    
    test_addresses = [
        "Rua Tenente Aníbal Medeiros, 113",
        "rua tenente Aníbal Medeiros ,número 113", 
        "Rua das Flores, 123 - Centro",
        "Bom dia, como vai?"
    ]
    
    for addr in test_addresses:
        result = classify_address_simple(addr)
        status = "✅ ENDEREÇO" if result['category'] == 'IS_ADDRESS' else "❌ NÃO-ENDEREÇO"
        print(f"Texto: {addr}")
        print(f"{status} ({result['confidence']:.3f})")
        print("-" * 30)
    
    print("\n💡 SOLUÇÃO: Usando classificação baseada em regras.")
    print("Para melhor precisão, treine um modelo textcat com o dataset fornecido.")

if __name__ == "__main__":
    main()