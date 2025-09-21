
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {Settings, User, Palette, Shield, Database, Save, Upload, Eye, EyeOff, Check, X, Camera} from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

interface UserProfile {
  name: string
  email: string
  phone: string
  role: string
  avatar: string | null
}

interface SecuritySettings {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
}

interface SystemSettings {
  backupFrequency: string
  backupTime: string
  dataRetention: string
  apiUrl: string
  apiKey: string
}

const Configuracoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('perfil')
  const [hasChanges, setHasChanges] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { currentTheme, setTheme, themes } = useTheme()
  const { user } = useAuth()

  // Estados para cada seção
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || 'Administrador FixCity',
    email: user?.email || 'admin@fixcity.com',
    phone: '(11) 99999-9999',
    role: user?.role || 'Administrador',
    avatar: user?.avatar || null
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  })

  const [system, setSystem] = useState<SystemSettings>({
    backupFrequency: 'daily',
    backupTime: '02:00',
    dataRetention: '1year',
    apiUrl: 'https://api.fixcity.com',
    apiKey: ''
  })

  const [language, setLanguage] = useState('pt-BR')

  const tabs = [
    { id: 'perfil', name: 'Perfil', icon: User },
    { id: 'aparencia', name: 'Aparência', icon: Palette },
    { id: 'seguranca', name: 'Segurança', icon: Shield },
    { id: 'sistema', name: 'Sistema', icon: Database }
  ]

  // Funções de atualização
  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateSecurity = (field: keyof SecuritySettings, value: string | boolean) => {
    setSecurity(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateSystem = (field: keyof SystemSettings, value: string) => {
    setSystem(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setHasChanges(true)
    const themeName = themes.find(t => t.id === newTheme)?.name
    toast.success(`Tema alterado para ${themeName}`)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setHasChanges(true)
    toast.success('Idioma alterado com sucesso!')
  }

  // Upload de avatar
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }))
        setHasChanges(true)
        toast.success('Avatar atualizado!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Validação de senha
  const validatePassword = () => {
    if (security.newPassword.length < 8) {
      toast.error('Nova senha deve ter pelo menos 8 caracteres')
      return false
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Senhas não coincidem')
      return false
    }
    if (!security.currentPassword) {
      toast.error('Digite a senha atual')
      return false
    }
    return true
  }

  const handlePasswordChange = () => {
    if (validatePassword()) {
      setSecurity(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      toast.success('Senha alterada com sucesso!')
    }
  }

  const toggleTwoFactor = () => {
    const newStatus = !security.twoFactorEnabled
    updateSecurity('twoFactorEnabled', newStatus)
    toast.success(newStatus ? 'Autenticação 2FA ativada!' : 'Autenticação 2FA desativada!')
  }

  const testApiConnection = async () => {
    try {
      toast.loading('Testando conexão...', { id: 'api-test' })
      // Simular teste de API
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Conexão com API estabelecida!', { id: 'api-test' })
    } catch (error) {
      toast.error('Falha na conexão com API', { id: 'api-test' })
    }
  }

  const handleSave = () => {
    if (!hasChanges) {
      toast.error('Nenhuma alteração para salvar')
      return
    }

    toast.loading('Salvando configurações...', { id: 'save' })
    
    // Simular salvamento
    setTimeout(() => {
      setHasChanges(false)
      toast.success('Configurações salvas com sucesso!', { id: 'save' })
    }, 1500)
  }

  const handleReset = () => {
    // Reset para valores padrão
    setProfile({
      name: user?.name || 'Administrador FixCity',
      email: user?.email || 'admin@fixcity.com',
      phone: '(11) 99999-9999',
      role: user?.role || 'Administrador',
      avatar: user?.avatar || null
    })
    setSecurity({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false
    })
    setTheme('coral')
    setLanguage('pt-BR')
    setHasChanges(false)
    toast.success('Configurações resetadas!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className={`w-24 h-24 bg-gradient-to-r ${currentTheme.colors.gradient} rounded-full flex items-center justify-center overflow-hidden`}>
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-colors"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm font-medium" style={{ color: currentTheme.colors.primary }}>{profile.role}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ 
                    '--tw-ring-color': currentTheme.colors.primary,
                    focusRingColor: currentTheme.colors.primary 
                  } as React.CSSProperties}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ 
                    '--tw-ring-color': currentTheme.colors.primary 
                  } as React.CSSProperties}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ 
                    '--tw-ring-color': currentTheme.colors.primary 
                  } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                <select 
                  value={profile.role}
                  onChange={(e) => updateProfile('role', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ 
                    '--tw-ring-color': currentTheme.colors.primary 
                  } as React.CSSProperties}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Operador">Operador</option>
                  <option value="Analista">Analista</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'aparencia':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tema do Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <motion.div
                    key={themeOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentTheme.id === themeOption.id 
                        ? 'shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: currentTheme.id === themeOption.id ? currentTheme.colors.primary : undefined,
                      backgroundColor: currentTheme.id === themeOption.id ? currentTheme.colors.light : undefined
                    }}
                    onClick={() => handleThemeChange(themeOption.id)}
                  >
                    <div className={`w-full h-16 bg-gradient-to-r ${themeOption.colors.gradient} rounded-lg mb-3 relative overflow-hidden`}>
                      {currentTheme.id === themeOption.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900">{themeOption.name}</h4>
                    <p className="text-sm text-gray-600">Tema {themeOption.name.toLowerCase()}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Idioma</h3>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  '--tw-ring-color': currentTheme.colors.primary 
                } as React.CSSProperties}
              >
                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                <option value="en-US">🇺🇸 English (US)</option>
                <option value="es-ES">🇪🇸 Español</option>
                <option value="fr-FR">🇫🇷 Français</option>
              </select>
              <p className="text-sm text-gray-600 mt-2">
                Idioma atual: {language === 'pt-BR' ? 'Português (Brasil)' : 
                              language === 'en-US' ? 'English (US)' :
                              language === 'es-ES' ? 'Español' : 'Français'}
              </p>
            </div>
          </div>
        )

      case 'seguranca':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) => updateSecurity('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ 
                        '--tw-ring-color': currentTheme.colors.primary 
                      } as React.CSSProperties}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={security.newPassword}
                      onChange={(e) => updateSecurity('newPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ 
                        '--tw-ring-color': currentTheme.colors.primary 
                      } as React.CSSProperties}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha *</label>
                  <input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => updateSecurity('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ 
                      '--tw-ring-color': currentTheme.colors.primary 
                    } as React.CSSProperties}
                    required
                  />
                  {security.confirmPassword && security.newPassword !== security.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Senhas não coincidem</p>
                  )}
                </div>
                <button 
                  onClick={handlePasswordChange}
                  disabled={!security.currentPassword || !security.newPassword || security.newPassword !== security.confirmPassword}
                  className={`bg-gradient-to-r ${currentTheme.colors.gradient} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Alterar Senha
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Autenticação de Dois Fatores</h3>
              <div className="p-4 rounded-lg border" style={{ backgroundColor: currentTheme.colors.light, borderColor: `${currentTheme.colors.primary}20` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">2FA via SMS</h4>
                    <p className="text-sm text-gray-600">
                      {security.twoFactorEnabled ? 'Ativado - Proteção extra habilitada' : 'Adicione uma camada extra de segurança'}
                    </p>
                  </div>
                  <button
                    onClick={toggleTwoFactor}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      security.twoFactorEnabled
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : `bg-gradient-to-r ${currentTheme.colors.gradient} text-white hover:opacity-90`
                    }`}
                  >
                    {security.twoFactorEnabled ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'sistema':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: currentTheme.colors.light, borderColor: `${currentTheme.colors.primary}20` }}>
                  <h4 className="font-medium text-gray-900 mb-2">Backup Automático</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Backup {system.backupFrequency === 'daily' ? 'diário' : system.backupFrequency === 'weekly' ? 'semanal' : 'mensal'} às {system.backupTime}
                  </p>
                  <div className="flex items-center space-x-4">
                    <select 
                      value={system.backupFrequency}
                      onChange={(e) => updateSystem('backupFrequency', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ 
                        '--tw-ring-color': currentTheme.colors.primary 
                      } as React.CSSProperties}
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                    <input
                      type="time"
                      value={system.backupTime}
                      onChange={(e) => updateSystem('backupTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ 
                        '--tw-ring-color': currentTheme.colors.primary 
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ backgroundColor: currentTheme.colors.light, borderColor: `${currentTheme.colors.primary}20` }}>
                  <h4 className="font-medium text-gray-900 mb-2">Retenção de Dados</h4>
                  <p className="text-sm text-gray-600 mb-3">Tempo de armazenamento dos registros</p>
                  <select 
                    value={system.dataRetention}
                    onChange={(e) => updateSystem('dataRetention', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      '--tw-ring-color': currentTheme.colors.primary 
                    } as React.CSSProperties}
                  >
                    <option value="6months">6 meses</option>
                    <option value="1year">1 ano</option>
                    <option value="2years">2 anos</option>
                    <option value="permanent">Permanente</option>
                  </select>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ backgroundColor: currentTheme.colors.light, borderColor: `${currentTheme.colors.primary}20` }}>
                  <h4 className="font-medium text-gray-900 mb-2">Integração API</h4>
                  <p className="text-sm text-gray-600 mb-3">Configurações de integração externa</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL da API</label>
                      <input
                        type="url"
                        value={system.apiUrl}
                        onChange={(e) => updateSystem('apiUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ 
                          '--tw-ring-color': currentTheme.colors.primary 
                        } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chave da API</label>
                      <input
                        type="password"
                        value={system.apiKey}
                        onChange={(e) => updateSystem('apiKey', e.target.value)}
                        placeholder="Digite a chave da API"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ 
                          '--tw-ring-color': currentTheme.colors.primary 
                        } as React.CSSProperties}
                      />
                    </div>
                    <button
                      onClick={testApiConnection}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    >
                      Testar Conexão
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${currentTheme.colors.gradient} rounded-2xl p-8 text-white shadow-2xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Configurações</h1>
              <p className="text-white/80 text-lg">Personalize sua experiência no FixCity</p>
            </div>
          </div>
          {hasChanges && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm font-medium">Alterações não salvas</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border" 
          style={{ borderColor: `${currentTheme.colors.primary}20` }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${currentTheme.colors.gradient} text-white shadow-lg transform scale-105`
                      : `text-gray-700 hover:bg-opacity-20 hover:text-gray-800`
                  }`}
                  style={{
                    backgroundColor: activeTab !== tab.id ? `${currentTheme.colors.primary}10` : undefined
                  }}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`} 
                  style={{ color: activeTab !== tab.id ? currentTheme.colors.primary : undefined }}
                  />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-lg border"
          style={{ borderColor: `${currentTheme.colors.primary}20` }}
        >
          <div className="p-8">
            {renderTabContent()}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Resetar</span>
                </button>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setHasChanges(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      hasChanges
                        ? `bg-gradient-to-r ${currentTheme.colors.gradient} text-white hover:opacity-90 shadow-lg`
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-5 h-5" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Configuracoes
