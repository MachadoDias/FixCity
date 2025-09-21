# FixCity - Sistema Integrado de Gestão Municipal

## Pré-requisitos
- Instalar o miniforge para gerar um ambiente isolado (https://github.com/mamba-org/micromamba-releases)
- Node.js (para o frontend React)
- Python 3.8+ (para o backend Flask)

## Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd FixCity
```

### 2. Configure o ambiente Python
```bash
# Crie o ambiente conda
mamba env create -f environment.yml

# Ative o ambiente
conda activate chatbot

# Instale o spaCy
python -m spacy download pt_core_news_sm
```

### 3. Configure o bot (opcional)
```bash
# Instale dependências do bot
npm install
```

## Executando o Sistema Integrado

### Backend (Flask)
```bash
# Ative o ambiente conda
conda activate chatbot

# Execute o backend
cd dashboard/backend
python main.py
```
Backend disponível em: http://localhost:5000



#### Frontend (React)
```bash
# Em outro terminal, vá para a pasta do frontend
cd dashboard/Frontend

# Instale dependências
npm install

# Execute o frontend
npm run dev
```
Frontend disponível em: http://localhost:5173

## Estrutura do Projeto

```
FixCity/
├── bot/                    # Bot WhatsApp
├── classifier/             # Modelos de IA
├── dashboard/
│   ├── backend/           # API Flask
│   │   ├── main.py        # Servidor principal
│   │   ├── db_interface.py # Interface do banco
│   │   └── config.py      # Configurações
│   └── Frontend/          # Interface React
│       ├── src/
│       │   ├── pages/     # Páginas da aplicação
│       │   ├── services/  # Serviços da API
│       │   └── components/ # Componentes React
│       └── package.json
├── scripts/               # Scripts utilitários
└── API_DOCS.md          # Documentação da API
```

## Funcionalidades Integradas

### Backend (Flask)
- ✅ API REST completa (GET, POST, PUT, DELETE)
- ✅ Banco de dados SQLite
- ✅ CORS configurado
- ✅ Estrutura de dados padronizada
- ✅ Suporte para upload de imagens

### Frontend (React)
- ✅ Interface moderna com Tailwind CSS
- ✅ Gestão de demandas em tempo real
- ✅ Gráficos dinâmicos baseados em dados reais
- ✅ Exibição de fotos das demandas
- ✅ Sistema de autenticação
- ✅ Integração completa com API

### Integração
- ✅ Comunicação frontend ↔ backend via API REST
- ✅ Mapeamento de dados automático
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Gráficos com dados em tempo real

## URLs do Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Documentação da API**: Ver API_DOCS.md

## Correções Implementadas

### ✅ Gráficos Corrigidos
- **Demandas por Categoria**: Agora usa dados reais das demandas
- **Atividades Recentes**: Baseado nas demandas reais do banco
- **Dados Mensais**: Calculados dinamicamente dos últimos 6 meses
- **Dados Semanais**: Baseados na distribuição real por dia da semana

### ✅ Fotos das Demandas
- **Lista de Demandas**: Coluna de foto adicionada na tabela
- **Visualização Detalhada**: Exibição da foto em tamanho maior
- **Tratamento de Erros**: Fallback quando imagem não carrega
- **Placeholder**: Ícone quando não há foto disponível

## Desenvolvimento

### Testando a API
```bash
# Listar demandas
curl http://localhost:5000/api/demands

# Criar demanda com foto
curl -X POST http://localhost:5000/api/demands \
  -H "Content-Type: application/json" \
  -d '{"title":"Iluminação","description":"Poste queimado","requester":"João","location":"Rua A","image_path":"https://example.com/foto.jpg"}'
```

### Logs
- Backend: Console do terminal onde foi executado
- Frontend: Console do navegador (F12)

## Desativando o Ambiente
```bash
conda deactivate
```  
