import { Moon, SunMedium, LogOut, ArrowRight } from 'lucide-react'
import type { User, CompanyPortal } from '../App'

type PortalSelectorProps = {
  user: User
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onSelectPortal: (portal: CompanyPortal) => void
  onLogout: () => void
}

export function PortalSelector({ user, theme, onToggleTheme, onSelectPortal, onLogout }: PortalSelectorProps) {
  const ThemeIcon = theme === 'light' ? Moon : SunMedium

  return (
    <div className="portal-selector">
      <div className="portal-header">
        <h1>Vallunex Command Center</h1>
        <p>Welcome back, {user.name}. Select a company workspace to continue.</p>
        <div className="portal-header-actions">
          <button type="button" className="secondary-button" onClick={onToggleTheme} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ThemeIcon style={{ width: 16, height: 16 }} />
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button type="button" className="ghost-button" onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LogOut style={{ width: 14, height: 14 }} />
            Logout
          </button>
        </div>
      </div>

      <div className="portal-grid">
        {/* RNXA Portal */}
        <button
          type="button"
          className="portal-card rnxa"
          onClick={() => onSelectPortal('rnxa')}
        >
          <div className="portal-card-icon">R</div>
          <h2>RNXA</h2>
          <p>Technology & digital solutions company. Manage development teams, projects, products, and client engagements.</p>
          <div className="portal-card-stats">
            <div className="portal-card-stat">
              <span className="portal-card-stat-value">Tech</span>
              <span className="portal-card-stat-label">Industry</span>
            </div>
            <div className="portal-card-stat">
              <span className="portal-card-stat-value">Full</span>
              <span className="portal-card-stat-label">Access</span>
            </div>
            <div className="portal-card-stat">
              <span className="portal-card-stat-value">Active</span>
              <span className="portal-card-stat-label">Status</span>
            </div>
          </div>
          <div className="portal-card-arrow">
            <ArrowRight style={{ width: 18, height: 18 }} />
          </div>
        </button>

        {/* Amenityforge Portal */}
        <button
          type="button"
          className="portal-card amenity"
          onClick={() => onSelectPortal('amenityforge')}
        >
          <div className="portal-card-icon">A</div>
          <h2>Amenityforge</h2>
          <p>Amenity & services management company. Oversee operations, service delivery, and workforce planning.</p>
          <div className="portal-card-stats">
            <div className="portal-card-stat">
              <span className="portal-card-stat-value">Services</span>
              <span className="portal-card-stat-label">Industry</span>
            </div>
            <div className="portal-card-stat">
              <span className="portal-card-stat-value">Full</span>
              <span className="portal-card-stat-label">Access</span>
            </div>
            <div className="portal-card-stat">
              <span className="portal-card-stat-value">Active</span>
              <span className="portal-card-stat-label">Status</span>
            </div>
          </div>
          <div className="portal-card-arrow">
            <ArrowRight style={{ width: 18, height: 18 }} />
          </div>
        </button>
      </div>
    </div>
  )
}
