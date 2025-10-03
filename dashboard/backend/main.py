from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
import db_interface as db
from config import Config
import os
import json
import time
from threading import Lock

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

# Lista de clientes conectados para SSE
clients = []
clients_lock = Lock()



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
    
    # Notificar clientes conectados sobre nova demanda
    notify_clients('new_demand', new_demand)
    
    return jsonify(new_demand), 201

@app.route('/api/demands/<int:demand_id>', methods=['PUT'])
def update_demand(demand_id):
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({'error': 'No data provided'}), 400
            
        updated_demand = db.update_demand(demand_id, payload)
        if not updated_demand:
            return jsonify({'error': 'Demand not found'}), 404
        
        # Notificar clientes conectados sobre demanda atualizada
        notify_clients('demand_updated', updated_demand)
        
        return jsonify(updated_demand), 200
    except Exception as e:
        print(f"Error updating demand {demand_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/demands/<int:demand_id>', methods=['DELETE'])
def delete_demand(demand_id):
    try:
        success = db.delete_demand(demand_id)
        if not success:
            return jsonify({'error': 'Demand not found'}), 404
        
        # Notificar clientes conectados sobre demanda removida
        notify_clients('demand_deleted', {'id': demand_id})
        
        return jsonify({'message': 'Demand deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting demand {demand_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

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

def notify_clients(event_type, data):
    """Notifica todos os clientes conectados via SSE"""
    with clients_lock:
        message = f"data: {json.dumps({'type': event_type, 'data': data})}\n\n"
        for client in clients[:]:
            try:
                client.put(message)
            except:
                clients.remove(client)

@app.route('/api/events')
def events():
    """Endpoint para Server-Sent Events"""
    def event_stream():
        import queue
        client_queue = queue.Queue()
        
        with clients_lock:
            clients.append(client_queue)
        
        try:
            while True:
                try:
                    message = client_queue.get(timeout=30)
                    yield message
                except queue.Empty:
                    yield "data: {\"type\": \"heartbeat\"}\n\n"
        except GeneratorExit:
            with clients_lock:
                if client_queue in clients:
                    clients.remove(client_queue)
    
    return Response(event_stream(), mimetype='text/event-stream',
                   headers={'Cache-Control': 'no-cache',
                           'Connection': 'keep-alive',
                           'Access-Control-Allow-Origin': '*'})

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)