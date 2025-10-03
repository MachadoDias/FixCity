#!/usr/bin/env python3
"""
Script para testar a API REST
"""
import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_api():
    print("=== Testando API REST ===")
    
    try:
        # Testar GET /demands
        print("1. Testando GET /demands...")
        response = requests.get(f"{BASE_URL}/demands")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            demands = response.json()
            print(f"OK - Encontradas {len(demands)} demandas")
            
            if demands:
                demand_id = demands[0]['id']
                print(f"Primeira demanda: ID {demand_id}")
                
                # Testar PUT /demands/{id}
                print(f"\n2. Testando PUT /demands/{demand_id}...")
                update_data = {'status': 'resolved'}
                response = requests.put(
                    f"{BASE_URL}/demands/{demand_id}",
                    json=update_data,
                    headers={'Content-Type': 'application/json'}
                )
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    updated = response.json()
                    print(f"OK - Status atualizado para: {updated['status']}")
                else:
                    print(f"ERRO - {response.text}")
                
                # Testar GET individual
                print(f"\n3. Testando GET /demands/{demand_id}...")
                response = requests.get(f"{BASE_URL}/demands/{demand_id}")
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    demand = response.json()
                    print(f"OK - Demanda encontrada: {demand['title']}")
                else:
                    print(f"ERRO - {response.text}")
        else:
            print(f"ERRO - {response.text}")
        
        # Testar POST (criar nova demanda)
        print("\n4. Testando POST /demands...")
        new_demand = {
            'title': 'Teste API',
            'description': 'Demanda criada via teste da API',
            'requester': 'Teste User',
            'location': 'Rua de Teste API'
        }
        response = requests.post(
            f"{BASE_URL}/demands",
            json=new_demand,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            created = response.json()
            test_id = created['id']
            print(f"OK - Nova demanda criada: ID {test_id}")
            
            # Testar DELETE
            print(f"\n5. Testando DELETE /demands/{test_id}...")
            response = requests.delete(f"{BASE_URL}/demands/{test_id}")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print("OK - Demanda excluída com sucesso")
            else:
                print(f"ERRO - {response.text}")
        else:
            print(f"ERRO - {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("ERRO - Não foi possível conectar ao servidor. Certifique-se de que o backend está rodando em http://localhost:5000")
    except Exception as e:
        print(f"ERRO - {str(e)}")
    
    print("\n=== Teste da API concluído ===")

if __name__ == "__main__":
    test_api()