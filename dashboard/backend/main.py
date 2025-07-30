from flask import Flask, jsonify, request
from flask_cors import CORS
import db_interface as db

app = Flask(__name__)
CORS(app)

     # Inicializa o banco no startup
db.init_db()

@app.route('/api/demands', methods=['GET'])
def get_demands():
         demands = db.list_demands()
         return jsonify(demands), 200

@app.route('/api/demands', methods=['POST'])
def post_demand():
         payload = request.get_json()
         required = ['title', 'requester', 'location']
         if not all(field in payload for field in required):
             return jsonify({'error': 'Missing required field'}), 400

         new_demand = db.create_demand(payload)
         return jsonify(new_demand), 201

if __name__ == '__main__':
         app.run(debug=True, port=5000)