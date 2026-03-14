import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ListTodo,
  Plus,
  Users,
  BriefcaseBusiness,
  FolderKanban,
  Package,
  ArrowLeftRight,
  ChevronRight,
  X,
} from 'lucide-react'
import type { UserRole, CompanyPortal } from '../../App'
import type { DashboardSection } from './DashboardLayout'
import type { ModalType } from '../modals/Modal'

type SidebarProps = {
  currentRole: UserRole
  portal: CompanyPortal
  activeSection: DashboardSection
  onChangeSection: (section: DashboardSection) => void
  onOpenModal: (type: ModalType) => void
  onSwitchPortal: () => void
  isMobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

export function Sidebar({ currentRole, portal, activeSection, onChangeSection, onOpenModal, onSwitchPortal, isMobileMenuOpen, onCloseMobileMenu }: SidebarProps) {
  const isAdmin = currentRole === 'admin'
  const isDev = currentRole === 'development'
  const isSales = currentRole === 'sales'

  const portalName = portal === 'rnxa' ? 'RNXA' : 'Amenityforge'
  const portalSub = portal === 'rnxa' ? 'Tech & Digital' : 'Services & Ops'

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'is-open' : ''}`}>
      <div className="sidebar-header">
        <div className={`sidebar-logo ${portal}`}>
          {portal === 'rnxa' ? 'R' : 'A'}
        </div>
        <div className="sidebar-brand">
          <span className="sidebar-title">{portalName}</span>
          <span className="sidebar-subtitle">{portalSub}</span>
        </div>
        {onCloseMobileMenu && (
          <button
            type="button"
            className="icon-button"
            onClick={onCloseMobileMenu}
            style={{ marginLeft: 'auto', display: 'flex' }}
            aria-label="Close menu"
          >
            <X className="sidebar-icon-svg" />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>

        <button
          className={`sidebar-link ${activeSection === 'overview' ? 'is-active' : ''}`}
          type="button"
          onClick={() => onChangeSection('overview')}
        >
          <span className="sidebar-icon">
            <LayoutDashboard className="sidebar-icon-svg" />
          </span>
          <span>Dashboard</span>
          <ChevronRight className="sidebar-icon-svg" style={{ marginLeft: 'auto', opacity: 0.3 }} />
        </button>

        {isAdmin && (
          <>
            <span className="sidebar-section-label">People</span>
            <button
              className={`sidebar-link ${activeSection === 'employees' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('employees')}
            >
              <span className="sidebar-icon">
                <Users className="sidebar-icon-svg" />
              </span>
              <span>Team Members</span>
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

            <span className="sidebar-section-label">Work</span>
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
              className={`sidebar-link ${activeSection === 'projects' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('projects')}
            >
              <span className="sidebar-icon">
                <FolderKanban className="sidebar-icon-svg" />
              </span>
              <span>Projects</span>
            </button>

            <span className="sidebar-section-label">Business</span>
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
              className={`sidebar-link ${activeSection === 'products' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('products')}
            >
              <span className="sidebar-icon">
                <Package className="sidebar-icon-svg" />
              </span>
              <span>Products</span>
            </button>
          </>
        )}

        {isDev && (
          <>
            <span className="sidebar-section-label">My Work</span>
            <button
              className={`sidebar-link ${activeSection === 'devTasks' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('devTasks')}
            >
              <span className="sidebar-icon">
                <ListTodo className="sidebar-icon-svg" />
              </span>
              <span>My Tasks</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'devProjects' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('devProjects')}
            >
              <span className="sidebar-icon">
                <FolderKanban className="sidebar-icon-svg" />
              </span>
              <span>My Projects</span>
            </button>
            <button
              className={`sidebar-link ${activeSection === 'devPayroll' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChangeSection('devPayroll')}
            >
              <span className="sidebar-icon">
                <CreditCard className="sidebar-icon-svg" />
              </span>
              <span>My Payroll</span>
            </button>
          </>
        )}

        {isSales && (
          <>
            <span className="sidebar-section-label">Sales Tools</span>
            <button
              className="sidebar-link"
              type="button"
              onClick={() => onOpenModal('addLead')}
            >
              <span className="sidebar-icon">
                <Plus className="sidebar-icon-svg" />
              </span>
              <span>Quick Add Lead</span>
            </button>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {isAdmin && (
          <>
            <button type="button" className="sidebar-quick-action" onClick={() => onOpenModal('addEmployee')}>
              <span className="sidebar-icon small">
                <Plus className="sidebar-icon-svg" />
              </span>
              <span>Add Team Member</span>
            </button>
            <button type="button" className="sidebar-quick-action" onClick={() => onOpenModal('addTask')}>
              <span className="sidebar-icon small">
                <ClipboardList className="sidebar-icon-svg" />
              </span>
              <span>Assign Task</span>
            </button>
          </>
        )}
        {isSales && (
          <button type="button" className="sidebar-quick-action" onClick={() => onOpenModal('addLead')}>
            <span className="sidebar-icon small">
              <Plus className="sidebar-icon-svg" />
            </span>
            <span>Add Lead</span>
          </button>
        )}
        <button type="button" className="sidebar-quick-action" onClick={onSwitchPortal}>
          <span className="sidebar-icon small">
            <ArrowLeftRight className="sidebar-icon-svg" />
          </span>
          <span>Switch Company</span>
        </button>
      </div>
    </aside>
  )
}
