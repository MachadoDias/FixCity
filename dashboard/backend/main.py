from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import db_interface as db
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=Config.CORS_ORIGINS)

# Criar diretórios necessários
os.makedirs(os.path.dirname(Config.DB_PATH), exist_ok=True)
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
# Criar diretório de uploads na pasta data
data_uploads_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'uploads')
os.makedirs(data_uploads_dir, exist_ok=True)
# Inicializa o banco no startup
db.init_db()



@app.route('/api/demands/<int:demand_id>', methods=['GET'])
def get_demand(demand_id):
    demand = db.get_demand(demand_id)
    if not demand:
        return jsonify({'error': 'Demand not found'}), 404
    return jsonify(demand), 200

@app.route('/api/demands', methods=['POST'])
def post_demand():
    payload = request.get_json()
    required = ['title', 'requester', 'location']
    if not all(field in payload for field in required):
        return jsonify({'error': 'Missing required field'}), 400

    new_demand = db.create_demand(payload)
    return jsonify(new_demand), 201

@app.route('/api/demands/<int:demand_id>', methods=['PUT'])
def update_demand(demand_id):
    payload = request.get_json()
    updated_demand = db.update_demand(demand_id, payload)
    if not updated_demand:
        return jsonify({'error': 'Demand not found'}), 404
    return jsonify(updated_demand), 200

@app.route('/api/demands/<int:demand_id>', methods=['DELETE'])
def delete_demand(demand_id):
    success = db.delete_demand(demand_id)
    if not success:
        return jsonify({'error': 'Demand not found'}), 404
    return '', 204

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files from data/uploads directory"""
    uploads_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'uploads')
    response = send_from_directory(uploads_dir, filename)
    # Adicionar headers CORS para imagens
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/api/demands', methods=['GET'])
def get_demands_with_full_image_urls():
    """Get demands with full image URLs"""
    demands = db.list_demands()
    # Convert relative image paths to full URLs
    for demand in demands:
        if demand.get('image_path'):
            # Convert data/uploads/filename.jpg to http://localhost:5000/uploads/filename.jpg
            if demand['image_path'].startswith('data/uploads/'):
                filename = demand['image_path'].replace('data/uploads/', '')
                demand['image_path'] = f"http://localhost:5000/uploads/{filename}"
    return jsonify(demands), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)