import spacy # type: ignore
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

class NameClassifier:
    def __init__(self, model_path="classifier/modelo_nomes"):
        """Inicializa o classificador de nomes"""
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
        """Classifica se o texto é um nome"""
        if not self.nlp:
            return None
        
        doc = self.nlp(text)
        
        if doc.cats:
            best_category = max(doc.cats.items(), key=lambda x: x[1])
            category = best_category[0]
            confidence = best_category[1]
        else:
            category = "NOT_NAME"
            confidence = 0.0
        
        return {
            "text": text,
            "category": category,
            "confidence": confidence,
            "all_scores": dict(doc.cats) if doc.cats else {}
        }

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
   "cachorro morrendo"
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
    
    # Teste endereço (AI)
    print("2. TESTE ENDEREÇO (AI):")
    
    addr_model_path = "modelo_endereco" if os.path.exists("modelo_endereco") else "classifier/modelo_endereco"
    classifier_addr = AddressClassifier(addr_model_path)
    
    if not classifier_addr.nlp:
        print("❌ ERRO: Modelo de endereço não encontrado!")
        print("Execute: python scripts/train_address_model.py")
        return
    else:
        print("✅ Modelo de endereço carregado")
    
    test_addresses = [
        "Praça Central do Bairro São José, próxima à Rua das Flores, nº 128.", "Rua das Acácias, nº 45, Bairro Jardim das Flores.",
        "Rua das Palmeiras, 75, Bairro São José"
    ]
    
    for addr in test_addresses:
        result = classifier_addr.classify(addr)
        if result:
            if result['confidence'] >= 0.9 and result['category'] == 'IS_ADDRESS':
                print("nwbbkwdjkdnjwk")
            status = "✅ ENDEREÇO" if result['category'] == 'IS_ADDRESS' else "❌ NÃO-ENDEREÇO"
            print(f"Texto: {addr}")
            print(f"{status} ({result['confidence']:.3f})")
            print(f"Scores: {result['all_scores']}")
            print("-" * 30)
        else:
            print(f"❌ Falha ao classificar: {addr}")
            print("-" * 30)
    
    print("\n" + "-" * 50 + "\n")
    
    # Teste nome (AI)
    print("3. TESTE NOME (AI):")
    
    name_model_path = "modelo_nomes" if os.path.exists("modelo_nomes") else "classifier/modelo_nomes"
    classifier_name = NameClassifier(name_model_path)
    
    if not classifier_name.nlp:
        print("❌ ERRO: Modelo de nome não encontrado!")
        print("Execute: python scripts/train_name_model.py")
        return
    else:
        print("✅ Modelo de nome carregado")
    
    test_names = [
        "João Silva",
        "Maria Santos",
        "Pedro Oliveira",
        "Ana Costa",
        "Carlos Ferreira"
    ]
    
    for name in test_names:
        result = classifier_name.classify(name)
        if result:
            status = "✅ NOME" if result['category'] == 'IS_NAME' else "❌ NOT_NOME"
            print(f"Texto: {name}")
            print(f"{status} ({result['confidence']:.3f})")
            print(f"Scores: {result['all_scores']}")
            print("-" * 30)
        else:
            print(f"❌ Falha ao classificar: {name}")
            print("-" * 30)
    
    print("\n💡 SOLUÇÃO: 100% AI - sem regex!")

if __name__ == "__main__":
    main()