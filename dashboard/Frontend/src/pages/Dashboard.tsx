
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Users, AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Calendar} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { apiService, Demand } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const [demands, setDemands] = useState<Demand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDemands = async () => {
      try {
        setLoading(true)
        const apiDemands = await apiService.getDemands()
        setDemands(apiDemands)
      } catch (error) {
        console.error('Erro ao carregar demandas:', error)
        toast.error('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDemands()
  }, [])

  const totalDemands = demands.length
  const pendingDemands = demands.filter(d => d.status === 'pending').length
  const resolvedDemands = demands.filter(d => d.status === 'resolved').length
  const inProgressDemands = demands.filter(d => d.status === 'in_progress').length

  const stats = [
    {
      name: 'Total de Demandas',
      value: totalDemands.toString(),
      icon: Users,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-[#ff8177]'
    },
    {
      name: 'Demandas Pendentes',
      value: pendingDemands.toString(),
      icon: Clock,
      change: '-8%',
      changeType: 'decrease',
      color: 'bg-yellow-500'
    },
    {
      name: 'Resolvidas',
      value: resolvedDemands.toString(),
      icon: CheckCircle,
      change: '+15%',
      changeType: 'increase',
      color: 'bg-green-500'
    },
    {
      name: 'Em Andamento',
      value: inProgressDemands.toString(),
      icon: AlertTriangle,
      change: '-4%',
      changeType: 'decrease',
      color: 'bg-orange-500'
    }
  ]

  const monthlyData = [
    { month: 'Jan', demandas: 120, resolvidas: 110 },
    { month: 'Fev', demandas: 135, resolvidas: 125 },
    { month: 'Mar', demandas: 148, resolvidas: 140 },
    { month: 'Abr', demandas: 162, resolvidas: 155 },
    { month: 'Mai', demandas: 175, resolvidas: 168 },
    { month: 'Jun', demandas: 190, resolvidas: 182 }
  ]

  const categoryData = [
    { name: 'Iluminação', value: demands.filter(d => d.title === 'Iluminação').length, color: '#3B82F6' },
    { name: 'Obras', value: demands.filter(d => d.title === 'Obras').length, color: '#8B5CF6' },
    { name: 'Limpeza', value: demands.filter(d => d.title === 'Limpeza').length, color: '#10B981' },
    { name: 'Saúde', value: demands.filter(d => d.title === 'Saúde').length, color: '#EF4444' }
  ].filter(item => item.value > 0)

  const weeklyData = [
    { day: 'Seg', demandas: 45 },
    { day: 'Ter', demandas: 52 },
    { day: 'Qua', demandas: 38 },
    { day: 'Qui', demandas: 61 },
    { day: 'Sex', demandas: 55 },
    { day: 'Sáb', demandas: 28 },
    { day: 'Dom', demandas: 15 }
  ]

  const recentActivities = demands.slice(0, 4).map(demand => ({
    id: demand.id || 0,
    type: demand.status === 'resolved' ? 'Resolvida' : 
          demand.status === 'in_progress' ? 'Em andamento' : 'Nova demanda',
    description: `${demand.description || demand.title} - ${demand.location}`,
    time: demand.created_at ? 
      `${Math.floor((Date.now() - new Date(demand.created_at).getTime()) / (1000 * 60 * 60))}h atrás` : 
      'Recém criada',
    priority: demand.status === 'pending' ? 'high' : 
              demand.status === 'in_progress' ? 'medium' : 'low'
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
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
        className="bg-gradient-to-r from-[#ff8177] to-[#ff6b5a] rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard FixCity</h1>
            <p className="text-orange-100 text-lg">Visão geral das demandas urbanas</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-orange-100 mb-1">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Hoje</span>
            </div>
            <div className="text-2xl font-semibold">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs. mês anterior</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="demandas" 
                stroke="#ff8177" 
                strokeWidth={3}
                name="Demandas"
              />
              <Line 
                type="monotone" 
                dataKey="resolvidas" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Resolvidas"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandas por Dia da Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="demandas" fill="#ff8177" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.priority === 'high' ? 'bg-red-500' :
                  activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
