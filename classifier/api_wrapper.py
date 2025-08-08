import sys
import json
from classify import DemandClassifier

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Texto não fornecido"}))
        return
    
    text = sys.argv[1]
    
    try:
        # Suprime prints do modelo
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = StringIO()
        
        classifier = DemandClassifier()
        
        # Restaura stdout
        sys.stdout = old_stdout
        
        result = classifier.classify(text)
        
        if result:
            # Mapeia para o formato esperado pelo sistema
            response = {
                "setor": result["category"].title(),
                "nome_cidadao": None,
                "local_demanda": None,
                "confidence": result["confidence"]
            }
            
            # Extrai nome e endereço das entidades
            for entity in result["entities"]:
                if entity["label"] == "NOME":
                    response["nome_cidadao"] = entity["text"]
                elif entity["label"] == "ENDERECO":
                    response["local_demanda"] = entity["text"]
            
            print(json.dumps(response, ensure_ascii=False))
        else:
            print(json.dumps({"error": "Erro na classificação"}))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()