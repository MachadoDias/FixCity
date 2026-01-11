import sqlite3
from sqlite3 import Connection, Row
from typing import List, Dict, Any
from config import Config
import requests
import os

DB_PATH = Config.DB_PATH

def translate_status(status: str) -> str:
    translations = {
        'pending': 'pendente',
        'in_progress': 'em andamento',
        'resolved': 'resolvida',
        'cancelled': 'cancelada'
    }
    return translations.get(status, status)

def get_connection() -> Connection:
         conn = sqlite3.connect(DB_PATH)
         conn.row_factory = Row
         return conn

def init_db():
         conn = get_connection()
         cursor = conn.cursor()
         cursor.execute('''
             CREATE TABLE IF NOT EXISTS demands (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title TEXT NOT NULL,
                 image_path TEXT,
                 description TEXT,
                 requester TEXT,
                 requester_contact TEXT,
                 location TEXT,
                 status TEXT DEFAULT 'pending',
                 created_at TEXT,
                 changes TEXT
             )
         ''')
         conn.commit()
         conn.close()

def list_demands() -> List[Dict[str, Any]]:
         conn = get_connection()
         demands = conn.execute('SELECT * FROM demands').fetchall()
         conn.close()
         return [dict(row) for row in demands]

def create_demand(data: Dict[str, Any]) -> Dict[str, Any]:
    from datetime import datetime
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Usar horário local do sistema
    local_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.execute(
        'INSERT INTO demands (title, description, requester, requester_contact, location, image_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (data['title'], data.get('description'), data.get('requester'), data.get('requester_contact'), data.get('location'), data.get('image_path'), local_timestamp)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {**data, 'id': new_id, 'created_at': local_timestamp}

def get_demand(demand_id: int) -> Dict[str, Any]:
    conn = get_connection()
    demand = conn.execute('SELECT * FROM demands WHERE id = ?', (demand_id,)).fetchone()
    conn.close()
    return dict(demand) if demand else None

def update_demand(demand_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    # Construir query dinamicamente baseado nos campos fornecidos
    fields = []
    values = []
    
    for field in ['title', 'description', 'requester', 'requester_contact', 'location', 'image_path', 'status']:
        if field in data:
            fields.append(f'{field} = ?')
            values.append(data[field])
    
    if not fields:
        return None
    
    values.append(demand_id)
    query = 'UPDATE demands SET ' + ', '.join(fields) + ' WHERE id = ?'
    
    cursor.execute(query, values)
    conn.commit()
    
    if cursor.rowcount == 0:
        conn.close()
        return None
    
    # Retornar a demanda atualizada
    updated_demand = conn.execute('SELECT * FROM demands WHERE id = ?', (demand_id,)).fetchone()
    
    # Notificar usuário via HTTP se status foi alterado
    if updated_demand and 'status' in data and updated_demand['requester_contact']:
        try:
            payload = {
                'contact': updated_demand['requester_contact'],
                'name': updated_demand['requester'],
                'sector': updated_demand['title'],
                'status': translate_status(data['status'])
            }
            
            response = requests.post('http://localhost:3001/notify', 
                                   json=payload, 
                                   timeout=5)
            
            if response.status_code == 200:
                print(f"✅ Notificação enviada para {updated_demand['requester']}")
            else:
                print(f"⚠️ Erro na notificação: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Bot não disponível: {e}")
    
    conn.close()
    return dict(updated_demand) if updated_demand else None

def delete_demand(demand_id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM demands WHERE id = ?', (demand_id,))
    conn.commit()
    success = cursor.rowcount > 0
    conn.close()
    return success