# FixCity API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Listar todas as demandas
**GET** `/demands`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Lâmpada queimada",
    "description": "Lâmpada da Rua A está queimada",
    "requester": "João Silva",
    "requester_contact": "(11) 99999-9999",
    "location": "Rua A, 123",
    "image_path": null,
    "status": "pending",
    "created_at": "2024-01-15 10:30:00"
  }
]
```

### 2. Obter demanda específica
**GET** `/demands/{id}`

**Response:**
```json
{
  "id": 1,
  "title": "Lâmpada queimada",
  "description": "Lâmpada da Rua A está queimada",
  "requester": "João Silva",
  "requester_contact": "(11) 99999-9999",
  "location": "Rua A, 123",
  "image_path": null,
  "status": "pending",
  "created_at": "2024-01-15 10:30:00"
}
```

### 3. Criar nova demanda
**POST** `/demands`

**Request Body:**
```json
{
  "title": "Buraco na rua",
  "description": "Buraco grande na Rua B",
  "requester": "Maria Santos",
  "requester_contact": "(11) 88888-8888",
  "location": "Rua B, 456",
  "image_path": "/uploads/foto.jpg"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "Buraco na rua",
  "description": "Buraco grande na Rua B",
  "requester": "Maria Santos",
  "requester_contact": "(11) 88888-8888",
  "location": "Rua B, 456",
  "image_path": "/uploads/foto.jpg",
  "status": "pending",
  "created_at": "2024-01-15 11:00:00"
}
```

### 4. Atualizar demanda
**PUT** `/demands/{id}`

**Request Body:**
```json
{
  "status": "in_progress",
  "description": "Descrição atualizada"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Lâmpada queimada",
  "description": "Descrição atualizada",
  "requester": "João Silva",
  "requester_contact": "(11) 99999-9999",
  "location": "Rua A, 123",
  "image_path": null,
  "status": "in_progress",
  "created_at": "2024-01-15 10:30:00"
}
```

### 5. Excluir demanda
**DELETE** `/demands/{id}`

**Response:** `204 No Content`

## Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Status da Demanda

- `pending` - Pendente
- `in_progress` - Em andamento
- `resolved` - Resolvida
- `cancelled` - Cancelada

## Campos Obrigatórios

### Criar demanda:
- `title` (string)
- `requester` (string)
- `location` (string)

### Campos opcionais:
- `description` (string)
- `requester_contact` (string)
- `image_path` (string)
- `status` (string) - padrão: "pending"