
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Usuários simulados para demonstração
  const users = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana@fixcity.com',
      password: '123456',
      role: 'Administradora',
      avatar: null
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos@fixcity.com',
      password: '123456',
      role: 'Supervisor',
      avatar: null
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria@fixcity.com',
      password: '123456',
      role: 'Operadora',
      avatar: null
    }
  ]

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('fixcity-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('fixcity-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar
      }
      
      setUser(userWithoutPassword)
      localStorage.setItem('fixcity-user', JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fixcity-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
