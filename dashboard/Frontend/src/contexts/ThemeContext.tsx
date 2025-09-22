
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    gradient: string
    light: string
    dark: string
  }
}

export const themes: Theme[] = [
  {
    id: 'coral',
    name: 'Coral Vibrante',
    colors: {
      primary: '#ff8177',
      secondary: '#ff6b5a',
      gradient: 'from-[#ff8177] to-[#ff6b5a]',
      light: '#fff5f4',
      dark: '#ff5a47'
    }
  },
  {
    id: 'ocean',
    name: 'Oceano',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      gradient: 'from-blue-500 to-blue-700',
      light: '#eff6ff',
      dark: '#1e40af'
    }
  },
  {
    id: 'forest',
    name: 'Floresta',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      gradient: 'from-emerald-500 to-green-600',
      light: '#ecfdf5',
      dark: '#047857'
    }
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      gradient: 'from-amber-500 to-orange-600',
      light: '#fffbeb',
      dark: '#b45309'
    }
  },
  {
    id: 'purple',
    name: 'Roxo Místico',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      gradient: 'from-violet-500 to-purple-600',
      light: '#f5f3ff',
      dark: '#6d28d9'
    }
  }
]

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])

  useEffect(() => {
    // Carregar tema salvo do localStorage
    const savedThemeId = localStorage.getItem('fixcity-theme')
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId)
      if (savedTheme) {
        setCurrentTheme(savedTheme)
      }
    }
  }, [])

  useEffect(() => {
    // Aplicar variáveis CSS customizadas
    const root = document.documentElement
    root.style.setProperty('--color-primary', currentTheme.colors.primary)
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary)
    root.style.setProperty('--color-light', currentTheme.colors.light)
    root.style.setProperty('--color-dark', currentTheme.colors.dark)
  }, [currentTheme])

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      localStorage.setItem('fixcity-theme', themeId)
    }
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}
