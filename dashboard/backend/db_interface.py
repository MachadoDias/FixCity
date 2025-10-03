import sqlite3
from sqlite3 import Connection, Row
from typing import List, Dict, Any
from config import Config
import subprocess
import os

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
    try:
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
            conn.close()
            return None
        
        values.append(demand_id)
        query = 'UPDATE demands SET ' + ', '.join(fields) + ' WHERE id = ?'
        
        print(f"Executing update query: {query} with values: {values}")
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            print(f"No rows updated for demand_id: {demand_id}")
            conn.close()
            return None
        
        # Retornar a demanda atualizada
        updated_demand = conn.execute('SELECT * FROM demands WHERE id = ?', (demand_id,)).fetchone()
        
        conn.close()
        result = dict(updated_demand) if updated_demand else None
        print(f"Updated demand result: {result}")
        return result
    except Exception as e:
        print(f"Error updating demand {demand_id}: {str(e)}")
        if 'conn' in locals():
            conn.close()
        raise e

def delete_demand(demand_id: int) -> bool:
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Verificar se a demanda existe antes de deletar
        existing = cursor.execute('SELECT id FROM demands WHERE id = ?', (demand_id,)).fetchone()
        if not existing:
            print(f"Demand {demand_id} not found for deletion")
            conn.close()
            return False
        
        print(f"Deleting demand {demand_id}")
        cursor.execute('DELETE FROM demands WHERE id = ?', (demand_id,))
        conn.commit()
        success = cursor.rowcount > 0
        
        print(f"Delete operation success: {success}, rows affected: {cursor.rowcount}")
        conn.close()
        return success
    except Exception as e:
        print(f"Error deleting demand {demand_id}: {str(e)}")
        if 'conn' in locals():
            conn.close()
        raise e