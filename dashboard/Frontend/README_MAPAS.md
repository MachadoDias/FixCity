# Configuração da Página de Mapas

## Setup do Google Maps API

1. **Obter chave da API:**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto ou selecione um existente
   - Ative as APIs: "Maps JavaScript API" e "Geocoding API"
   - Crie uma chave de API
   - Configure restrições de domínio se necessário

2. **Configurar a chave:**
   - Abra `src/config/maps.ts`
   - Substitua `YOUR_GOOGLE_MAPS_API_KEY` pela sua chave

3. **Executar o projeto:**
   ```bash
   npm run dev
   ```

## Funcionalidades

- Visualização de demandas no mapa com marcadores
- Filtro por status das demandas
- Lista lateral com detalhes das demandas
- InfoWindows com informações ao clicar nos marcadores
- Integração com API do backend para buscar demandas
- Design responsivo seguindo o padrão do projeto

## Estrutura

- `src/pages/Mapas.tsx` - Componente principal da página
- `src/config/maps.ts` - Configurações do Google Maps
- Integração com contextos de tema e autenticação existentes