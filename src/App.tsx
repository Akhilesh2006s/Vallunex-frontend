import { useEffect, useState } from 'react'
import './App.css'
import { LoginScreen } from './components/LoginScreen'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AppDataProvider } from './state/AppDataContext'

export type UserRole = 'admin' | 'sales' | 'development'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  token: string
}

type ThemeMode = 'light' | 'dark'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('vallunex-theme') as ThemeMode | null
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('vallunex-theme', theme)
  }, [theme])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  if (!user) {
    return (
      <div className="app-shell login-shell">
        <LoginScreen onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />
      </div>
    )
  }

  return (
    <AppDataProvider authToken={user.token}>
      <div className="app-shell">
        <DashboardLayout user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      </div>
    </AppDataProvider>
  )
}

export default App
