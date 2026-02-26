import { useState, type FormEvent } from 'react'
import type { User, UserRole } from '../App'

type LoginScreenProps = {
  onLogin: (user: User) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://vallunex-company-app-backend-production.up.railway.app/api'

type LoginState = 'idle' | 'loading' | 'error'

export function LoginScreen({ onLogin, theme, onToggleTheme }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<LoginState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setStatus('error')
        setErrorMessage(data.error || 'Unable to sign in. Check credentials.')
        return
      }

      const user = (await res.json()) as { id: string; email: string; name: string; role: UserRole; token: string }
      onLogin(user)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage('Network error. Make sure the API server is running.')
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev))
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-mark">V</span>
            <div className="logo-text">
              <span className="logo-title">Vallunex</span>
              <span className="logo-subtitle">Command Cntre</span>
            </div>
          </div>
          <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="login-body">
          <h1>Welcome back</h1>
          <p className="login-subtitle">Sign in to manage payroll, projects and tasks in one place.</p>

          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            <label className="form-label" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-select"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vallunex.com"
              required
            />

            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-select"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {status === 'error' && <p className="login-error-text">{errorMessage}</p>}

            <button type="submit" className="primary-button login-button" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in…' : 'Continue'}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}


