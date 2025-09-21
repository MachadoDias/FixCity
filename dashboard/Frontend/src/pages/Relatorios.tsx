
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {Calendar, Download, Filter, TrendingUp, Clock, CheckCircle, AlertTriangle, BarChart3, PieChart as PieChartIcon, Activity} from 'lucide-react'
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
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { useTheme } from '../contexts/ThemeContext'

const Relatorios: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedSetor, setSelectedSetor] = useState('todos')
  const { currentTheme } = useTheme()

  // Dados simulados para os gráficos
  const demandasMensais = [
    { mes: 'Jan', pendentes: 12, em_andamento: 8, resolvidas: 25, canceladas: 2 },
    { mes: 'Fev', pendentes: 15, em_andamento: 12, resolvidas: 30, canceladas: 1 },
    { mes: 'Mar', pendentes: 10, em_andamento: 15, resolvidas: 35, canceladas: 3 },
    { mes: 'Abr', pendentes: 8, em_andamento: 10, resolvidas: 28, canceladas: 2 },
    { mes: 'Mai', pendentes: 18, em_andamento: 14, resolvidas: 32, canceladas: 4 },
    { mes: 'Jun', pendentes: 22, em_andamento: 18, resolvidas: 40, canceladas: 2 }
  ]

  const eficienciaPorCategoria = [
    { setor: 'Iluminação', eficiencia: 85 },
    { setor: 'Obras', eficiencia: 72 },
    { setor: 'Limpeza', eficiencia: 90 },
    { setor: 'Saúde', eficiencia: 78 }
  ]

  const tempoMedioResolucao = [
    { setor: 'Iluminação', tempo: 3.2 },
    { setor: 'Obras', tempo: 12.5 },
    { setor: 'Limpeza', tempo: 2.8 },
    { setor: 'Saúde', tempo: 8.1 }
  ]

  const distribuicaoStatus = [
    { name: 'Resolvidas', value: 165, color: '#10B981' },
    { name: 'Em Andamento', value: 77, color: '#ff8177' },
    { name: 'Pendentes', value: 85, color: '#F59E0B' },
    { name: 'Canceladas', value: 14, color: '#EF4444' }
  ]

  const tendenciaResolucao = [
    { periodo: 'Sem 1', resolvidas: 12, meta: 15 },
    { periodo: 'Sem 2', resolvidas: 18, meta: 15 },
    { periodo: 'Sem 3', resolvidas: 14, meta: 15 },
    { periodo: 'Sem 4', resolvidas: 22, meta: 15 },
    { periodo: 'Sem 5', resolvidas: 16, meta: 15 },
    { periodo: 'Sem 6', resolvidas: 25, meta: 15 }
  ]

  const volumeDemandas = [
    { dia: '01', volume: 8 },
    { dia: '02', volume: 12 },
    { dia: '03', volume: 15 },
    { dia: '04', volume: 9 },
    { dia: '05', volume: 18 },
    { dia: '06', volume: 22 },
    { dia: '07', volume: 14 },
    { dia: '08', volume: 11 },
    { dia: '09', volume: 16 },
    { dia: '10', volume: 19 }
  ]

  const exportarRelatorio = () => {
    // Lógica para exportar relatório
    console.log('Exportando relatório...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${currentTheme.colors.gradient} rounded-2xl p-8 text-white shadow-2xl`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Relatórios e Analytics</h1>
            <p className="text-white/80 text-lg mt-2">Análise completa do desempenho da gestão urbana</p>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <button
              onClick={exportarRelatorio}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': currentTheme.colors.primary 
              } as React.CSSProperties}
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
            
            <select
              value={selectedSetor}
              onChange={(e) => setSelectedSetor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': currentTheme.colors.primary 
              } as React.CSSProperties}
            >
              <option value="todos">Todos os setores</option>
              <option value="iluminacao">Iluminação</option>
              <option value="obras">Obras</option>
              <option value="limpeza">Limpeza</option>
              <option value="saude">Saúde</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Demandas</p>
              <p className="text-3xl font-bold mt-2" style={{ color: currentTheme.colors.primary }}>341</p>
              <p className="text-sm text-green-600 mt-1">+12% vs mês anterior</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-lg flex items-center justify-center`}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Demandas Resolvidas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">165</p>
              <p className="text-sm text-green-600 mt-1">+8% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">6.4</p>
              <p className="text-sm text-gray-500 mt-1">dias para resolução</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Eficiência</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">81%</p>
              <p className="text-sm text-green-600 mt-1">+5% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução das Demandas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Evolução das Demandas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={demandasMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="resolvidas" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Resolvidas"
              />
              <Area 
                type="monotone" 
                dataKey="em_andamento" 
                stackId="1" 
                stroke="#ff8177" 
                fill="#ff8177" 
                fillOpacity={0.6}
                name="Em Andamento"
              />
              <Area 
                type="monotone" 
                dataKey="pendentes" 
                stackId="1" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.6}
                name="Pendentes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição por Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Distribuição por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribuicaoStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {distribuicaoStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eficiência por Categoria */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Eficiência por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eficienciaPorCategoria} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="setor" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value) => [`${value}%`, 'Eficiência']} />
              <Bar dataKey="eficiencia" fill={currentTheme.colors.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tempo Médio de Resolução */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tempo Médio de Resolução</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tempoMedioResolucao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="setor" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} dias`, 'Tempo Médio']} />
              <Bar dataKey="tempo" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Gráficos de Tendência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Resolução */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tendência de Resolução vs Meta</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tendenciaResolucao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="resolvidas" 
                stroke={currentTheme.colors.primary} 
                strokeWidth={3}
                name="Resolvidas"
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="#94A3B8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Volume de Demandas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Volume Diário de Demandas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeDemandas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke={currentTheme.colors.primary} 
                fill={currentTheme.colors.primary}
                fillOpacity={0.3}
                name="Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Métricas Detalhadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Métricas Detalhadas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-blue-900">Taxa de Resolução</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">84.3%</p>
            <p className="text-sm text-blue-600 mt-1">das demandas resolvidas</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-green-900">Demandas Resolvidas</h4>
            <p className="text-3xl font-bold text-green-600 mt-2">165</p>
            <p className="text-sm text-green-600 mt-1">no período selecionado</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-purple-900">Tempo Médio SLA</h4>
            <p className="text-3xl font-bold text-purple-600 mt-2">5.2</p>
            <p className="text-sm text-purple-600 mt-1">dias dentro do prazo</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-orange-900">Eficiência Geral</h4>
            <p className="text-3xl font-bold text-orange-600 mt-2">81%</p>
            <p className="text-sm text-orange-600 mt-1">performance do sistema</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Relatorios
