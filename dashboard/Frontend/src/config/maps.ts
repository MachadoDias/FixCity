// Configuração do Google Maps
export const GOOGLE_MAPS_CONFIG = {
  // Substitua pela sua chave da API do Google Maps
  API_KEY: 'AIzaSyAlgUxT1CcSquGt859VGuXrE9-iq3KZoG0',
  
  // Configurações padrão do mapa
  DEFAULT_CENTER: {
    lat: -22.272778, // São Paulo
    lng: -45.64
  },
  
  DEFAULT_ZOOM: 12,
  
  // Estilos do mapa
  MAP_STYLES: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

// Função para verificar se a API key está configurada
export const isGoogleMapsConfigured = (): boolean => {
  return GOOGLE_MAPS_CONFIG.API_KEY !== 'AIzaSyAlgUxT1CcSquGt859VGuXrE9-iq3KZoG0'
}