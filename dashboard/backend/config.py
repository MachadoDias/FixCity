"""
Configurações do backend FixCity
"""
import os

class Config:
    # Configurações do Flask
    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-fixcity'
    
    # Configurações do banco de dados
    DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'demands.db')
    
    # Configurações CORS
    CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']
    
    # Configurações da API
    API_PREFIX = '/api'
    
    # Configurações de upload de arquivos
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size