import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ListTodo,
  Plus,
  Users,
  BriefcaseBusiness,
  FolderKanban,
} from 'lucide-react'
import type { UserRole } from '../../App'
import type { ModalType } from '../modals/Modal'

type DashboardSection =
  | 'overview'
  | 'employees'
  | 'payroll'
  | 'leads'
  | 'products'
  | 'adminTasks'
  | 'clients'
  | 'projects'
  | 'devTasks'
  | 'devPayroll'
  | 'devProjects'

type SidebarProps = {
  currentRole: UserRole
  activeSection: DashboardSection
  onChangeSection: (section: DashboardSection) => void
  onOpenModal: (type: ModalType) => void
}

export function Sidebar({ currentRole, activeSection, onChangeSection, onOpenModal }: SidebarProps) {
  const isAdmin = currentRole === 'admin'
  const isDev = currentRole === 'development'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-mark">V</span>
        </div>
        <div className="sidebar-brand">
          <span className="sidebar-title">Vallunex</span>
          <span className="sidebar-subtitle">Command Center</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Navigation</span>

        <button
          className={`sidebar-link ${activeSection === 'overview' ? 'is-active' : ''}`}
          type="button"
          onClick={() => onChangeSection('overview')}
        >
          <span className="sidebar-icon">
            <LayoutDashboard className="sidebar-icon-svg" />
          </span>
          <span>Dashboard</span>
        </button>

        {isAdmin && (
          <>
            <button
              className={`sidebar-link ${activeSection === 'employees' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('employees')}
            >
              <span className="sidebar-icon">
                <Users className="sidebar-icon-svg" />
              </span>
              <span>Team members</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'payroll' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('payroll')}
            >
              <span className="sidebar-icon">
                <CreditCard className="sidebar-icon-svg" />
              </span>
              <span>Payroll</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'adminTasks' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('adminTasks')}
            >
              <span className="sidebar-icon">
                <ClipboardList className="sidebar-icon-svg" />
              </span>
              <span>Tasks</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'leads' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('leads')}
            >
              <span className="sidebar-icon">
                <BriefcaseBusiness className="sidebar-icon-svg" />
              </span>
              <span>Leads</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'products' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('products')}
            >
              <span className="sidebar-icon">
                <FolderKanban className="sidebar-icon-svg" />
              </span>
              <span>Products</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'clients' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('clients')}
            >
              <span className="sidebar-icon">
                <BriefcaseBusiness className="sidebar-icon-svg" />
              </span>
              <span>Clients</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'projects' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('projects')}
            >
              <span className="sidebar-icon">
                <FolderKanban className="sidebar-icon-svg" />
              </span>
              <span>Projects</span>
            </button>
          </>
        )}

        {isDev && (
          <>
            <button
              className={`sidebar-link ${activeSection === 'devTasks' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('devTasks')}
            >
              <span className="sidebar-icon">
                <ListTodo className="sidebar-icon-svg" />
              </span>
              <span>My tasks</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'devPayroll' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('devPayroll')}
            >
              <span className="sidebar-icon">
                <CreditCard className="sidebar-icon-svg" />
              </span>
              <span>My payroll</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'devProjects' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('devProjects')}
            >
              <span className="sidebar-icon">
                <FolderKanban className="sidebar-icon-svg" />
              </span>
              <span>My projects</span>
            </button>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-section-label">Quick Actions</span>
        {currentRole === 'admin' && null}
        {currentRole === 'sales' && (
          <button type="button" className="sidebar-quick-action" onClick={() => onOpenModal('addLead')}>
            <span className="sidebar-icon small">
              <Plus className="sidebar-icon-svg" />
            </span>
            <span>Add lead</span>
          </button>
        )}
        {currentRole === 'admin' && (
          <button type="button" className="sidebar-quick-action" onClick={() => onOpenModal('addTask')}>
            <span className="sidebar-icon small">
              <ClipboardList className="sidebar-icon-svg" />
            </span>
            <span>Add task</span>
          </button>
        )}
      </div>
    </aside>
  )
}


