
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {MapPin, Eye, EyeOff, LogIn, AlertCircle} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const { currentTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    const success = await login(email, password)
    
    if (!success) {
      setError('Email ou senha incorretos')
      toast.error('Credenciais inválidas')
    } else {
      toast.success('Login realizado com sucesso!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-20 h-20 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
          >
            <MapPin className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.colors.gradient} bg-clip-text text-transparent mb-2`}>
              FixCity
            </h1>
            <p className="text-gray-600 text-lg">Sistema de Gestão Urbana</p>
            <p className="text-sm text-gray-500 mt-2">Entre com suas credenciais para acessar</p>
          </motion.div>
        </div>

        {/* Formulário de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                style={{ 
                  '--tw-ring-color': currentTheme.colors.primary 
                } as React.CSSProperties}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  style={{ 
                    '--tw-ring-color': currentTheme.colors.primary 
                  } as React.CSSProperties}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gradient-to-r ${currentTheme.colors.gradient} text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Usuários de demonstração */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Usuários para teste:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Ana Silva</strong> - ana@fixcity.com</p>
                <p>Senha: 123456 (Administradora)</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Carlos Santos</strong> - carlos@fixcity.com</p>
                <p>Senha: 123456 (Supervisor)</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Maria Oliveira</strong> - maria@fixcity.com</p>
                <p>Senha: 123456 (Operadora)</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          © 2025 FixCity. Sistema de Gestão Urbana Inteligente.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
