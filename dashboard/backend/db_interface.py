import sqlite3
from sqlite3 import Connection, Row
from typing import List, Dict, Any
from config import Config

DB_PATH = Config.DB_PATH

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
                 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
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
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO demands (title, description, requester, requester_contact, location, image_path) VALUES (?, ?, ?, ?, ?, ?)',
        (data['title'], data.get('description'), data.get('requester'), data.get('requester_contact'), data.get('location'), data.get('image_path'))
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {**data, 'id': new_id}

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