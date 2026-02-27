import { Bell, Moon, Search, SunMedium } from 'lucide-react'

type TopbarProps = {
  title: string
  userName: string
  userEmail: string
  onLogout: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Topbar({ title, userName, userEmail: _userEmail, onLogout, theme, onToggleTheme }: TopbarProps) {
  const ThemeIcon = theme === 'light' ? Moon : SunMedium

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-center">
        <div className="search-wrapper">
          <span className="search-icon">
            <Search className="topbar-icon-svg" />
          </span>
          <input className="search-input" placeholder="Search in Vallunex Command Center" />
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="topbar-icon-button"
          aria-label="Toggle light and dark mode"
          onClick={onToggleTheme}
        >
          <ThemeIcon className="topbar-icon-svg" />
        </button>
        <button type="button" className="topbar-icon-button" aria-label="Notifications">
          <Bell className="topbar-icon-svg" />
        </button>
        <div className="topbar-profile">
          <div className="avatar-circle">{initials}</div>
          <div className="profile-meta">
            <span className="profile-name">{userName}</span>
            <button type="button" className="profile-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}


