import sqlite3
from sqlite3 import Connection, Row
from typing import List, Dict, Any

DB_PATH = 'demands.db'

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
                 created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
             (data['title'], data.get('description'), data.get('requester'),data.get('requester_contact'), data.get('location'), data.get('image_path'))
         )
         conn.commit()
         new_id = cursor.lastrowid
         conn.close()
         return {**data, 'id': new_id}