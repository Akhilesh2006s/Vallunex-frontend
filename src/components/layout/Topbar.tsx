import { useState, useEffect, useRef } from 'react'
import { Bell, Moon, Search, SunMedium, X, Menu, LogOut } from 'lucide-react'
import { useAppData } from '../../state/AppDataContext'
import type { CompanyPortal, UserRole } from '../../App'
import type { DashboardSection } from './DashboardLayout'

type TopbarProps = {
  title: string
  userName: string
  userEmail: string
  portal: CompanyPortal
  onLogout: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onNavigateToSection: (section: DashboardSection) => void
  onOpenMobileMenu: () => void
  userRole: UserRole
}

export function Topbar({
  title,
  userName,
  userEmail: _userEmail,
  portal,
  onLogout,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  onNavigateToSection,
  onOpenMobileMenu,
  userRole,
}: TopbarProps) {
  const ThemeIcon = theme === 'light' ? Moon : SunMedium
  const { employees, projects, tasks, leads, products } = useAppData()
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

  // Search logic
  const searchLower = searchQuery.toLowerCase().trim()
  const searchResults = {
    employees: searchLower
      ? employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchLower) ||
            emp.email?.toLowerCase().includes(searchLower) ||
            emp.role.toLowerCase().includes(searchLower),
        )
      : [],
    projects: searchLower
      ? projects.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.clientName.toLowerCase().includes(searchLower) ||
            p.ownerEmployeeName.toLowerCase().includes(searchLower),
        )
      : [],
    tasks: searchLower
      ? tasks.filter((t) => t.title.toLowerCase().includes(searchLower) || t.assignedTo.toLowerCase().includes(searchLower))
      : [],
    leads: searchLower
      ? leads.filter(
          (l) =>
            l.clientName.toLowerCase().includes(searchLower) ||
            l.salesRep.toLowerCase().includes(searchLower),
        )
      : [],
    products: searchLower
      ? products.filter((p) => p.name.toLowerCase().includes(searchLower) || p.techStack.toLowerCase().includes(searchLower))
      : [],
  }

  const totalResults =
    searchResults.employees.length +
    searchResults.projects.length +
    searchResults.tasks.length +
    searchResults.leads.length +
    searchResults.products.length

  useEffect(() => {
    setShowSearchResults(searchQuery.trim().length > 0 && totalResults > 0)
  }, [searchQuery, totalResults])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleResultClick = (_type: string, section: DashboardSection) => {
    onNavigateToSection(section)
    onSearchChange('')
    setShowSearchResults(false)
  }

  // Build notifications from actual data
  const notifications: Array<{ title: string; meta: string; type: 'info' | 'warning' | 'success' }> = []

  const pendingTasks = tasks.filter((t) => t.status === 'Submitted')
  if (pendingTasks.length > 0) {
    notifications.push({
      title: `${pendingTasks.length} task${pendingTasks.length > 1 ? 's' : ''} awaiting review`,
      meta: 'Submitted by team members',
      type: 'warning',
    })
  }

  const pendingPayroll = employees.filter((e) => e.status === 'Pending')
  if (pendingPayroll.length > 0) {
    notifications.push({
      title: `${pendingPayroll.length} payroll${pendingPayroll.length > 1 ? 's' : ''} pending approval`,
      meta: 'Awaiting admin action',
      type: 'warning',
    })
  }

  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status === 'Open')
  if (highPriority.length > 0) {
    notifications.push({
      title: `${highPriority.length} high-priority task${highPriority.length > 1 ? 's' : ''} open`,
      meta: 'Needs immediate attention',
      type: 'info',
    })
  }

  const clientCount = leads.filter((l) => l.status === 'Client').length
  if (clientCount > 0) {
    notifications.push({
      title: `${clientCount} active client${clientCount > 1 ? 's' : ''} in pipeline`,
      meta: 'Revenue generating',
      type: 'success',
    })
  }

  if (projects.length > 0) {
    const activeProjects = projects.filter((p) => p.status === 'In Progress').length
    notifications.push({
      title: `${activeProjects} project${activeProjects !== 1 ? 's' : ''} in progress`,
      meta: `${projects.length} total projects`,
      type: 'info',
    })
  }

  if (notifications.length === 0) {
    notifications.push({
      title: 'All caught up!',
      meta: 'No pending actions right now',
      type: 'success',
    })
  }

  const sectionMap: Record<string, { label: string; section: DashboardSection }> = {
    employees: { label: 'Employees', section: 'employees' },
    projects: { label: 'Projects', section: 'projects' },
    tasks: { label: 'Tasks', section: 'adminTasks' },
    leads: { label: 'Leads', section: 'leads' },
    products: { label: 'Products', section: 'products' },
  }

  const roleLabelMap: Record<UserRole, string> = {
    admin: 'Admin',
    sales: 'Sales',
    development: 'Dev',
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu style={{ width: 20, height: 20 }} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-center" ref={searchRef}>
        <div className="search-wrapper">
          <span className="search-icon">
            <Search className="topbar-icon-svg" />
          </span>
          <input
            className="search-input"
            placeholder={`Search in ${portal === 'rnxa' ? 'RNXA' : 'Amenityforge'}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => searchQuery.trim().length > 0 && totalResults > 0 && setShowSearchResults(true)}
          />
          {searchQuery && (
            <button
              type="button"
              className="icon-button"
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24 }}
              onClick={() => {
                onSearchChange('')
                setShowSearchResults(false)
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {showSearchResults && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: 400,
              overflowY: 'auto',
              zIndex: 1000,
              padding: 8,
            }}
          >
            {Object.entries(searchResults).map(([key, items]) => {
              if (items.length === 0) return null
              const config = sectionMap[key]
              if (!config) return null

              return (
                <div key={key}>
                  <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {config.label} ({items.length})
                  </div>
                  {items.slice(0, 3).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleResultClick(key, config.section)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 13,
                        fontWeight: 500,
                        display: 'block',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      {item.name || item.title || item.clientName} 
                      <span style={{ color: 'var(--color-text-faint)', fontWeight: 400 }}>
                        {' · '}{item.role || item.assignedTo || item.salesRep || item.techStack || item.clientName || ''}
                      </span>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="topbar-icon-button"
          aria-label="Toggle theme"
          onClick={onToggleTheme}
        >
          <ThemeIcon className="topbar-icon-svg" />
        </button>

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="topbar-icon-button"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative' }}
          >
            <Bell className="topbar-icon-svg" />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-danger)',
                border: '2px solid var(--color-bg)',
              }} />
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              width: 320,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontWeight: 700, fontSize: 14 }}>
                Notifications
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map((notif, i) => (
                  <div key={i} style={{
                    padding: '12px 16px',
                    borderBottom: i < notifications.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      marginTop: 6,
                      flexShrink: 0,
                      background: notif.type === 'warning' ? 'var(--color-warning)' : notif.type === 'success' ? 'var(--color-success)' : 'var(--color-info)',
                    }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{notif.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>{notif.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-profile">
          <div className={`avatar-circle ${portal === 'amenityforge' ? 'amenity' : ''}`} style={portal === 'amenityforge' ? { background: 'var(--amenity-gradient)' } : undefined}>
            {initials}
          </div>
          <div className="profile-meta">
            <span className="profile-name">{userName}</span>
            <button type="button" className="profile-logout" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </div>
        <div className="topbar-profile-mobile">
          <div className={`avatar-circle ${portal === 'amenityforge' ? 'amenity' : ''}`} style={portal === 'amenityforge' ? { background: 'var(--amenity-gradient)' } : undefined}>
            {initials}
          </div>
          <div className="profile-meta-mobile">
            <span className="profile-name-mobile">{userName}</span>
            <span className="profile-role-mobile">{roleLabelMap[userRole]}</span>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onLogout}
            aria-label="Sign out"
            style={{ marginLeft: 'auto' }}
          >
            <LogOut style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </header>
  )
}
