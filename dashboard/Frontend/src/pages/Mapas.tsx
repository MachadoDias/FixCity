import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Filter, RefreshCw } from 'lucide-react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { apiService } from '../services/api'
import { GOOGLE_MAPS_CONFIG } from '../config/maps'

interface Demand {
  id: number
  title: string
  description: string
  requester: string
  location: string
  status: string
  created_at: string
  image_path?: string
}

interface MapProps {
  center: google.maps.LatLngLiteral
  zoom: number
  demands: Demand[]
  onMarkerClick: (demand: Demand) => void
}

const Map: React.FC<MapProps> = ({ center, zoom, demands, onMarkerClick }) => {
  const [map, setMap] = useState<google.maps.Map>()
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const { currentTheme } = useTheme()

  const ref = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const newMap = new google.maps.Map(node, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [center, zoom])

  useEffect(() => {
    if (map) {
      // Limpar marcadores existentes
      markers.forEach(marker => marker.setMap(null))
      
      const newMarkers: google.maps.Marker[] = []
      const geocoder = new google.maps.Geocoder()

      if (demands && Array.isArray(demands)) {
        demands.forEach((demand) => {
          if (!demand || !demand.location) return
          
          geocoder.geocode({ address: demand.location }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
            const marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map,
              title: demand.title,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: currentTheme.colors.primary,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            })

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 250px;">
                  <h3 style="margin: 0 0 8px 0; color: ${currentTheme.colors.primary}; font-size: 16px;">${demand.title}</h3>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Solicitante:</strong> ${demand.requester}</p>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Local:</strong> ${demand.location}</p>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Status:</strong> ${demand.status}</p>
                </div>
              `
            })

            marker.addListener('click', () => {
              infoWindow.open(map, marker)
              onMarkerClick(demand)
            })

            newMarkers.push(marker)
          }
          })
        })
      }

      setMarkers(newMarkers)
    }
  }, [map, demands, currentTheme.colors.primary, onMarkerClick])

  return <div ref={ref} className="w-full h-full" />
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erro ao carregar o mapa</p>
          </div>
        </div>
      )
    default:
      return null
  }
}

const Mapas: React.FC = () => {
  const [demands, setDemands] = useState<Demand[]>([])
  const [filteredDemands, setFilteredDemands] = useState<Demand[]>([])
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const { currentTheme } = useTheme()

  const center = GOOGLE_MAPS_CONFIG.DEFAULT_CENTER
  const zoom = GOOGLE_MAPS_CONFIG.DEFAULT_ZOOM

  const loadDemands = async () => {
    try {
      setLoading(true)
      const demands = await apiService.getDemands()
      setDemands(demands)
      setFilteredDemands(demands)
    } catch (error) {
      toast.error('Erro ao carregar demandas')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDemands()
  }, [])

  useEffect(() => {
    if (!demands || !Array.isArray(demands)) {
      setFilteredDemands([])
      return
    }
    
    if (statusFilter === 'all') {
      setFilteredDemands(demands)
    } else {
      setFilteredDemands(demands.filter(demand => demand.status === statusFilter))
    }
  }, [demands, statusFilter])

  const handleMarkerClick = (demand: Demand) => {
    setSelectedDemand(demand)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'em andamento': return 'bg-blue-100 text-blue-800'
      case 'concluída': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Demandas</h1>
          <p className="mt-2 text-gray-600">Visualize a localização das demandas no mapa</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': currentTheme.colors.primary } as React.CSSProperties}
          >
            <option value="all">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluída">Concluída</option>
          </select>
          
          <button
            onClick={loadDemands}
            disabled={loading}
            className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="h-96 lg:h-[600px]">
            <Wrapper apiKey={GOOGLE_MAPS_CONFIG.API_KEY} render={render}>
              <Map
                center={center}
                zoom={zoom}
                demands={filteredDemands}
                onMarkerClick={handleMarkerClick}
              />
            </Wrapper>
          </div>
        </motion.div>

        {/* Sidebar com lista de demandas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Demandas</h2>
            <span className="text-sm text-gray-500">{filteredDemands?.length || 0} total</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredDemands && filteredDemands.length > 0 ? filteredDemands.map((demand) => (
              <div
                key={demand.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedDemand?.id === demand.id ? 'border-2' : 'border-gray-200'
                }`}
                style={{
                  borderColor: selectedDemand?.id === demand.id ? currentTheme.colors.primary : undefined
                }}
                onClick={() => setSelectedDemand(demand)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{demand.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{demand.location}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(demand.status)}`}>
                      {demand.status}
                    </span>
                  </div>
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-500 py-4">
                {loading ? 'Carregando...' : 'Nenhuma demanda encontrada'}
              </div>
            )}
          </div>

          {selectedDemand && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Detalhes da Demanda</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Título:</span> {selectedDemand.title}</p>
                <p><span className="font-medium">Solicitante:</span> {selectedDemand.requester}</p>
                <p><span className="font-medium">Local:</span> {selectedDemand.location}</p>
                <p><span className="font-medium">Status:</span> {selectedDemand.status}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Mapas