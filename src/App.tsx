import { useEffect, useState } from 'react'
import './App.css'
import { LoginScreen } from './components/LoginScreen'
import { PortalSelector } from './components/PortalSelector'
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

export type CompanyPortal = 'rnxa' | 'amenityforge'

type ThemeMode = 'light' | 'dark'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [selectedPortal, setSelectedPortal] = useState<CompanyPortal | null>(null)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('vallunex-theme') as ThemeMode | null
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    }

    const storedUser = window.localStorage.getItem('vallunex-user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User
        if (parsed && parsed.token && parsed.email && parsed.role) {
          setUser(parsed)
        }
      } catch {
        window.localStorage.removeItem('vallunex-user')
      }
    }

    const storedPortal = window.localStorage.getItem('vallunex-portal') as CompanyPortal | null
    if (storedPortal === 'rnxa' || storedPortal === 'amenityforge') {
      setSelectedPortal(storedPortal)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('vallunex-theme', theme)
  }, [theme])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    window.localStorage.setItem('vallunex-user', JSON.stringify(loggedInUser))
    // Reset portal selection so user picks fresh
    setSelectedPortal(null)
    window.localStorage.removeItem('vallunex-portal')
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedPortal(null)
    window.localStorage.removeItem('vallunex-user')
    window.localStorage.removeItem('vallunex-portal')
  }

  const handleSelectPortal = (portal: CompanyPortal) => {
    setSelectedPortal(portal)
    window.localStorage.setItem('vallunex-portal', portal)
  }

  const handleSwitchPortal = () => {
    setSelectedPortal(null)
    window.localStorage.removeItem('vallunex-portal')
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // Not logged in → show login
  if (!user) {
    return (
      <div className="app-shell login-shell">
        <LoginScreen onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />
      </div>
    )
  }

  // Logged in but no portal selected → show portal selector
  if (!selectedPortal) {
    return (
      <div className="app-shell portal-shell">
        <PortalSelector
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSelectPortal={handleSelectPortal}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  // Logged in + portal selected → show dashboard
  return (
    <AppDataProvider authToken={user.token} company={selectedPortal}>
      <div className="app-shell">
        <DashboardLayout
          user={user}
          portal={selectedPortal}
          onLogout={handleLogout}
          onSwitchPortal={handleSwitchPortal}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    </AppDataProvider>
  )
}

export default App
