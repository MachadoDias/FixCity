
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {LayoutDashboard, FileText, LogOut, Menu, X, MapPin, Settings, BarChart3, User} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { currentTheme } = useTheme()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: currentTheme.colors.gradient },
    { name: 'Demandas', href: '/demandas', icon: FileText, color: currentTheme.colors.gradient },
    { name: 'Mapas', href: '/mapas', icon: MapPin, color: currentTheme.colors.gradient },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3, color: currentTheme.colors.gradient },
    { name: 'Configurações', href: '/configuracoes', icon: Settings, color: currentTheme.colors.gradient },
  ]

  const handleLogout = () => {
    logout()
  }

  const getThemeClasses = (isActive: boolean) => {
    if (isActive) {
      return `bg-gradient-to-r ${currentTheme.colors.gradient} text-white shadow-xl`
    }
    return `text-gray-700 hover:bg-gradient-to-r hover:${currentTheme.colors.gradient} hover:bg-opacity-20`
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-gradient-to-b from-white via-orange-50 to-red-50 shadow-2xl border-r border-orange-100">
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${currentTheme.colors.gradient} bg-clip-text text-transparent`}>FixCity</h1>
                <p className="text-sm font-medium" style={{ color: currentTheme.colors.primary }}>Gestão Urbana Inteligente</p>
              </div>
            </div>
          </div>

          {/* Informações do usuário */}
          <div className="px-6 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-full flex items-center justify-center`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`group flex items-center px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${getThemeClasses(isActive)}`}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          isActive ? 'text-white' : `group-hover:text-[${currentTheme.colors.primary}]`
                        }`}
                        style={{ color: isActive ? 'white' : currentTheme.colors.primary }}
                      />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
            
            <div className="px-4 pb-6">
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-4 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
              >
                <LogOut className="mr-4 h-5 w-5 text-red-500 group-hover:text-red-600" />
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 md:hidden"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-white via-orange-50 to-red-50"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-xl flex items-center justify-center`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold bg-gradient-to-r ${currentTheme.colors.gradient} bg-clip-text text-transparent`}>FixCity</h1>
                    <p className="text-sm" style={{ color: currentTheme.colors.primary }}>Gestão Urbana</p>
                  </div>
                </div>
              </div>

              {/* Usuário mobile */}
              <div className="px-4 mt-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-full flex items-center justify-center`}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${getThemeClasses(isActive)}`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-white' : ''
                        }`}
                        style={{ color: isActive ? 'white' : currentTheme.colors.primary }}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            
            <div className="flex-shrink-0 px-2 pb-4">
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-3 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                Sair do Sistema
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-white to-orange-50 px-4 py-3 shadow-lg border-b border-orange-100">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-orange-100"
              style={{ color: currentTheme.colors.primary }}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-lg flex items-center justify-center`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-lg font-bold bg-gradient-to-r ${currentTheme.colors.gradient} bg-clip-text text-transparent`}>FixCity</h1>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-full flex items-center justify-center`}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
