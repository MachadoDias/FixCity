
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Search, Filter, MapPin, Clock, User, AlertCircle, CheckCircle, XCircle, Eye, Calendar, BarChart3, Phone, Camera, Edit, Save, X, ArrowLeft, History, Trash2} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { apiService, Demand } from '../services/api'

interface HistoricoAlteracao {
  id: number
  data: string
  usuario: string
  statusAnterior: string
  statusNovo: string
  observacao?: string
}

interface Demanda {
  id: number
  titulo: string
  setor: 'Iluminação' | 'Obras' | 'Limpeza' | 'Saúde'
  status: 'pendente' | 'em_andamento' | 'resolvida' | 'cancelada'
  localizacao: string
  solicitante: string
  telefone: string
  dataAbertura: string
  dataUltimaAtualizacao: string
  descricao: string
  foto?: string
  usuarioUltimaAlteracao?: string
  historico: HistoricoAlteracao[]
}

function mapApiDemandToLocal(apiDemand: Demand): Demanda {
  return {
    id: apiDemand.id || 0,
    titulo: apiDemand.description || apiDemand.title,
    setor: apiDemand.title as 'Iluminação' | 'Obras' | 'Limpeza' | 'Saúde',
    status: mapApiStatusToLocal(apiDemand.status || 'pending'),
    localizacao: apiDemand.location,
    solicitante: apiDemand.requester,
    telefone: apiDemand.requester_contact || 'Não informado',
    dataAbertura: apiDemand.created_at ? new Date(apiDemand.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dataUltimaAtualizacao: apiDemand.created_at ? new Date(apiDemand.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    descricao: apiDemand.description || apiDemand.title,
    foto: apiDemand.image_path,
    historico: [{
      id: 1,
      data: apiDemand.created_at ? new Date(apiDemand.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      usuario: 'Sistema',
      statusAnterior: '',
      statusNovo: mapApiStatusToLocal(apiDemand.status || 'pending'),
      observacao: 'Demanda criada'
    }]
  }
}

function mapApiStatusToLocal(apiStatus: string): 'pendente' | 'em_andamento' | 'resolvida' | 'cancelada' {
  switch (apiStatus) {
    case 'pending': return 'pendente'
    case 'in_progress': return 'em_andamento'
    case 'resolved': return 'resolvida'
    case 'cancelled': return 'cancelada'
    default: return 'pendente'
  }
}

function mapLocalStatusToApi(localStatus: 'pendente' | 'em_andamento' | 'resolvida' | 'cancelada'): string {
  switch (localStatus) {
    case 'pendente': return 'pending'
    case 'em_andamento': return 'in_progress'
    case 'resolvida': return 'resolved'
    case 'cancelada': return 'cancelled'
    default: return 'pending'
  }
}

const Demandas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todas')
  const [filterSetor, setFilterSetor] = useState('todos')
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null)
  const [editingStatus, setEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusObservacao, setStatusObservacao] = useState('')
  const [demandas, setDemandas] = useState<Demanda[]>([])
  const [apiDemands, setApiDemands] = useState<Demand[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const { currentTheme } = useTheme()
  const { user } = useAuth()

  useEffect(() => {
    const loadDemands = async () => {
      try {
        setLoading(true)
        const fetchedApiDemands = await apiService.getDemands()
        const mappedDemands = fetchedApiDemands.map(mapApiDemandToLocal)
        setApiDemands(fetchedApiDemands)
        setDemandas(mappedDemands)
      } catch (error) {
        console.error('Erro ao carregar demandas:', error)
        toast.error('Erro ao carregar demandas')
      } finally {
        setLoading(false)
      }
    }

    loadDemands()
    
    // Listener para novas demandas
    const handleNewDemand = () => {
      loadDemands()
    }
    
    window.addEventListener('newDemand', handleNewDemand)
    return () => window.removeEventListener('newDemand', handleNewDemand)
  }, [])

  const statusData = [
    { name: 'Pendentes', value: demandas.filter(d => d.status === 'pendente').length, color: '#F59E0B' },
    { name: 'Em Andamento', value: demandas.filter(d => d.status === 'em_andamento').length, color: '#ff8177' },
    { name: 'Resolvidas', value: demandas.filter(d => d.status === 'resolvida').length, color: '#10B981' }
  ]

  const setorData = [
    { setor: 'Iluminação', quantidade: demandas.filter(d => d.setor === 'Iluminação').length },
    { setor: 'Obras', quantidade: demandas.filter(d => d.setor === 'Obras').length },
    { setor: 'Limpeza', quantidade: demandas.filter(d => d.setor === 'Limpeza').length },
    { setor: 'Saúde', quantidade: demandas.filter(d => d.setor === 'Saúde').length }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-4 h-4" />
      case 'em_andamento':
        return <AlertCircle className="w-4 h-4" />
      case 'resolvida':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelada':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'em_andamento':
        return 'bg-orange-100 text-orange-800'
      case 'resolvida':
        return 'bg-green-100 text-green-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSetorColor = (setor: string) => {
    switch (setor) {
      case 'Iluminação':
        return 'bg-blue-100 text-blue-800'
      case 'Obras':
        return 'bg-purple-100 text-purple-800'
      case 'Limpeza':
        return 'bg-green-100 text-green-800'
      case 'Saúde':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDemandas = demandas.filter(demanda => {
    const matchesSearch = demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demanda.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demanda.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demanda.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'todas' || demanda.status === filterStatus
    const matchesSetor = filterSetor === 'todos' || demanda.setor === filterSetor

    return matchesSearch && matchesStatus && matchesSetor
  })

  const handleViewDemanda = (demanda: Demanda) => {
    setSelectedDemanda(demanda)
  }

  const handleStatusChange = async () => {
    if (!selectedDemanda || !newStatus || !user) return

    try {
      const apiStatus = mapLocalStatusToApi(newStatus as any)
      await apiService.updateDemand(selectedDemanda.id, { status: apiStatus })
      
      const novaAlteracao: HistoricoAlteracao = {
        id: selectedDemanda.historico.length + 1,
        data: new Date().toISOString().split('T')[0],
        usuario: user.name,
        statusAnterior: selectedDemanda.status,
        statusNovo: newStatus,
        observacao: statusObservacao || 'Status alterado'
      }

      const demandaAtualizada = {
        ...selectedDemanda,
        status: newStatus as any,
        dataUltimaAtualizacao: new Date().toISOString().split('T')[0],
        usuarioUltimaAlteracao: user.name,
        historico: [...selectedDemanda.historico, novaAlteracao]
      }

      setSelectedDemanda(demandaAtualizada)
      
      // Atualizar lista local
      setDemandas(prev => prev.map(d => 
        d.id === selectedDemanda.id ? demandaAtualizada : d
      ))
      
      setEditingStatus(false)
      setNewStatus('')
      setStatusObservacao('')
      
      toast.success(`Status alterado para ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const handleDeleteDemand = async () => {
    if (!selectedDemanda || !deleteReason) return
    if (deleteReason === 'Outro motivo' && !customReason.trim()) return

    try {
      await apiService.deleteDemand(selectedDemanda.id)
      
      // Remover da lista local
      setDemandas(prev => prev.filter(d => d.id !== selectedDemanda.id))
      
      const finalReason = deleteReason === 'Outro motivo' ? customReason : deleteReason
      
      setShowDeleteModal(false)
      setDeleteReason('')
      setCustomReason('')
      setSelectedDemanda(null)
      
      toast.success(`Demanda excluída. Motivo: ${finalReason}`)
    } catch (error) {
      console.error('Erro ao excluir demanda:', error)
      toast.error('Erro ao excluir demanda')
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (selectedDemanda) {
    return (
      <div className="space-y-6">
        {/* Header da demanda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${currentTheme.colors.gradient} rounded-2xl p-8 text-white shadow-2xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSelectedDemanda(null)}
                className="mr-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Demanda #{selectedDemanda.id}</h1>
                <p className="text-white/80 text-lg">{selectedDemanda.titulo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedDemanda.status)} bg-white/20 text-white`}>
                {getStatusIcon(selectedDemanda.status)}
                <span className="ml-2">{formatStatus(selectedDemanda.status)}</span>
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalhes da demanda */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Informações da Demanda</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Setor</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSetorColor(selectedDemanda.setor)}`}>
                    {selectedDemanda.setor}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Localização</label>
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedDemanda.localizacao}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data de Abertura</label>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(selectedDemanda.dataAbertura).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Descrição</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedDemanda.descricao}</p>
              </div>
            </motion.div>

            {/* Solicitante */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Dados do Solicitante</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedDemanda.solicitante}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                  <div className="flex items-center text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedDemanda.telefone}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Foto */}
            {(() => {
              const apiDemand = apiDemands.find(d => d.id === selectedDemanda.id)
              return apiDemand?.image_path && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Foto da Demanda
                  </h3>
                  <div className="relative">
                    <img 
                      src={apiDemand.image_path} 
                      alt="Foto da demanda" 
                      className="w-full max-w-md rounded-lg shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.innerHTML = '<div class="text-gray-500 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">Erro ao carregar imagem</div>'
                      }}
                    />
                  </div>
                </motion.div>
              )
            })()}
          </div>

          {/* Sidebar direita */}
          <div className="space-y-6">
            {/* Alterar Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
              
              {!editingStatus ? (
                <button
                  onClick={() => setEditingStatus(true)}
                  className={`w-full bg-gradient-to-r ${currentTheme.colors.gradient} text-white px-4 py-3 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  <Edit className="w-4 h-4" />
                  <span>Alterar Status</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      '--tw-ring-color': currentTheme.colors.primary 
                    } as React.CSSProperties}
                  >
                    <option value="">Selecione o status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="resolvida">Resolvida</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  
                  <textarea
                    value={statusObservacao}
                    onChange={(e) => setStatusObservacao(e.target.value)}
                    placeholder="Observação (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      '--tw-ring-color': currentTheme.colors.primary 
                    } as React.CSSProperties}
                    rows={3}
                  />
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleStatusChange}
                      disabled={!newStatus}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.colors.gradient} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingStatus(false)
                        setNewStatus('')
                        setStatusObservacao('')
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Botão de Exclusão */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir Demanda</span>
                </button>
              </div>
            </motion.div>

            {/* Última alteração */}
            {selectedDemanda.usuarioUltimaAlteracao && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Última Alteração</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {selectedDemanda.usuarioUltimaAlteracao}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(selectedDemanda.dataUltimaAtualizacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Histórico */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <History className="w-5 h-5 mr-2" />
                Histórico de Alterações
              </h3>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {selectedDemanda.historico.map((item) => (
                  <div key={item.id} className="border-l-4 pl-4 pb-4" style={{ borderColor: currentTheme.colors.primary }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.usuario}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.statusAnterior ? (
                        <>
                          <span className="text-red-600">{formatStatus(item.statusAnterior)}</span>
                          {' → '}
                          <span className="text-green-600">{formatStatus(item.statusNovo)}</span>
                        </>
                      ) : (
                        <span className="text-green-600">{formatStatus(item.statusNovo)}</span>
                      )}
                    </div>
                    {item.observacao && (
                      <p className="text-xs text-gray-500 mt-1">{item.observacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Modal de Exclusão */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Excluir Demanda</h3>
                    <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da exclusão *
                  </label>
                  <select
                    value={deleteReason}
                    onChange={(e) => {
                      setDeleteReason(e.target.value)
                      if (e.target.value !== 'Outro motivo') {
                        setCustomReason('')
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione o motivo</option>
                    <option value="Demanda falsa">Demanda falsa</option>
                    <option value="Duplicada">Demanda duplicada</option>
                    <option value="Fora do escopo">Fora do escopo municipal</option>
                    <option value="Informações insuficientes">Informações insuficientes</option>
                    <option value="Outro motivo">Outro motivo</option>
                  </select>
                  
                  {deleteReason === 'Outro motivo' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descreva o motivo *
                      </label>
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Digite o motivo da exclusão..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDeleteReason('')
                      setCustomReason('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteDemand}
                    disabled={!deleteReason || (deleteReason === 'Outro motivo' && !customReason.trim())}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando demandas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Demandas</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as solicitações da cidade</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Demandas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Setor</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={setorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="setor" 
                tick={{ fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="quantidade" fill={currentTheme.colors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar demandas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  '--tw-ring-color': currentTheme.colors.primary 
                } as React.CSSProperties}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': currentTheme.colors.primary 
              } as React.CSSProperties}
            >
              <option value="todas">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="resolvida">Resolvida</option>
              <option value="cancelada">Cancelada</option>
            </select>
            
            <select
              value={filterSetor}
              onChange={(e) => setFilterSetor(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': currentTheme.colors.primary 
              } as React.CSSProperties}
            >
              <option value="todos">Todos os Setores</option>
              <option value="Iluminação">Iluminação</option>
              <option value="Obras">Obras</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Saúde">Saúde</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Demandas List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Demandas ({filteredDemandas.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demanda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDemandas.map((demanda) => {
                // Mapear demanda da API para formato local
                const apiDemand = apiDemands.find(d => d.id === demanda.id)
                
                return (
                <tr key={demanda.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {apiDemand?.image_path ? (
                        <img 
                          src={apiDemand.image_path} 
                          alt="Foto da demanda" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML = '<div class="text-gray-400 text-xs text-center"><svg class="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>Sem foto</div>'
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">
                          <Camera className="w-6 h-6 mx-auto mb-1" />
                          Sem foto
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{demanda.titulo}</div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <User className="w-3 h-3 mr-1" />
                        {demanda.solicitante}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSetorColor(demanda.setor)}`}>
                      {demanda.setor}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(demanda.status)}`}>
                      {getStatusIcon(demanda.status)}
                      <span className="ml-1 capitalize">{demanda.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {demanda.localizacao}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(demanda.dataAbertura).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      Atualizada: {new Date(demanda.dataUltimaAtualizacao).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDemanda(demanda)}
                      className="hover:opacity-80 transition-colors duration-200"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )})
              }
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Demandas
