import spacy

def test_model():
    """Testa o modelo treinado"""
    
    # Carrega o modelo
    nlp = spacy.load("classifier/model")
    
    # Textos de teste
    test_texts = [
        "tem um buraco na rua aqui perto",
        "a lâmpada do poste queimou",
        "preciso marcar consulta no posto",
        "tem lixo acumulado na calçada",
        "sou o João Silva, tem problema na rua das flores 123"
    ]
    
    print("=== TESTE DO MODELO ===\n")
    
    for text in test_texts:
        doc = nlp(text)
        
        print(f"Texto: '{text}'")
        
        # Classificação de categorias
        print("Categorias:")
        for label, score in doc.cats.items():
            if score > 0.5:
                print(f"  - {label}: {score:.3f}")
        
        # Entidades nomeadas
        if doc.ents:
            print("Entidades:")
            for ent in doc.ents:
                print(f"  - {ent.text} ({ent.label_})")
        
        print("-" * 50)

if __name__ == "__main__":
    test_model()