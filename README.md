# FixCity - Sistema Integrado de Gestão Municipal

<img width="1919" height="977" alt="image" src="https://github.com/user-attachments/assets/6fbca375-c7d7-4536-b50c-89302a4ceb00" />


## Objetivo
FixCity é uma solução que visa à facilitação da comunicação entre cidadãos e prefeitura, trata-se de um chatbot no WhatsApp, ao qual a população pode relatar problemas na cidade como, por exemplo, postes quebrados, e um WebApp para os gestores, onde todas as demandas no município podem ser visualizadas, além de gráficos e informações úteis para a otimização do atendimento municipal. O sistema conta com verificação de informações por meio de modelos NLP e API externa para checagem de endereços.

O projeto foi desenvolvido para a PROJETE 2025, feira de projetos da Escola Francisco Moreira da Costa e foi premiado na categoria "Prêmio de Inovação Municipal".

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


