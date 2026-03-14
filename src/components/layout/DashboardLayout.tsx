import type { ReactNode } from 'react'
import type { User, UserRole, CompanyPortal } from '../../App'
import { AdminDashboard } from '../../pages/AdminDashboard'
import { SalesDashboard } from '../../pages/SalesDashboard'
import { DevelopmentDashboard } from '../../pages/DevelopmentDashboard'
import { EmployeesPage } from '../../pages/EmployeesPage'
import { ClientsPage } from '../../pages/ClientsPage'
import { ProjectsPage } from '../../pages/ProjectsPage'
import { LeadsPage } from '../../pages/LeadsPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { EmployeeTasksPage } from '../../pages/EmployeeTasksPage'
import { PayrollPage } from '../../pages/PayrollPage'
import { DevTasksPage } from '../../pages/DevTasksPage'
import { DevPayrollPage } from '../../pages/DevPayrollPage'
import { DevProjectsPage } from '../../pages/DevProjectsPage'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useState } from 'react'
import { Modal, type ModalType } from '../modals/Modal'

type DashboardLayoutProps = {
  user: User
  portal: CompanyPortal
  onLogout: () => void
  onSwitchPortal: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export type DashboardSection =
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

function RoleActionsBar({
  role,
  portal,
  onOpenModal,
}: {
  role: UserRole
  portal: CompanyPortal
  onOpenModal: (type: ModalType) => void
}) {
  const portalName = portal === 'rnxa' ? 'RNXA' : 'Amenityforge'

  if (role === 'admin') {
    return (
      <div className="page-actions-row">
        <div>
          <h2 className="page-actions-title">{portalName} – Admin Workspace</h2>
          <p className="page-actions-subtitle">
            Complete overview of company metrics, team workload, deadlines and financials.
          </p>
        </div>
        <div className="page-actions-buttons">
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addEmployee')}>
            + Add Member
          </button>
          <button type="button" className="secondary-button" onClick={() => onOpenModal('addTask')}>
            + New Task
          </button>
        </div>
      </div>
    )
  }

  if (role === 'sales') {
    return (
      <div className="page-actions-row">
        <div>
          <h2 className="page-actions-title">{portalName} – Sales Workspace</h2>
          <p className="page-actions-subtitle">Track pipeline, convert leads and stay on top of client engagements.</p>
        </div>
        <div className="page-actions-buttons">
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addLead')}>
            + Add Lead
          </button>
        </div>
      </div>
    )
  }

  if (role === 'development') {
    return (
      <div className="page-actions-row">
        <div>
          <h2 className="page-actions-title">{portalName} – Development Workspace</h2>
          <p className="page-actions-subtitle">Submit work, review sprints and keep delivery on track.</p>
        </div>
        <div className="page-actions-buttons">
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addTask')}>
            + New Task
          </button>
        </div>
      </div>
    )
  }

  return null
}

export function DashboardLayout({ user, portal, onLogout, onSwitchPortal, theme, onToggleTheme }: DashboardLayoutProps) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const role = user.role

  const openModal = (type: ModalType) => {
    setActiveModal(type)
    setIsMobileMenuOpen(false) // Close mobile menu when opening modal
  }
  const closeModal = () => setActiveModal(null)

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section)
    setIsMobileMenuOpen(false) // Close mobile menu when navigating
  }

  let content: ReactNode = null

  if (role === 'admin') {
    if (activeSection === 'overview') content = <AdminDashboard onOpenModal={openModal} portal={portal} />
    if (activeSection === 'employees') content = <EmployeesPage onOpenModal={openModal} />
    if (activeSection === 'payroll') content = <PayrollPage />
    if (activeSection === 'leads') content = <LeadsPage />
    if (activeSection === 'products') content = <ProductsPage />
    if (activeSection === 'adminTasks') content = <EmployeeTasksPage />
    if (activeSection === 'clients') content = <ClientsPage />
    if (activeSection === 'projects') content = <ProjectsPage onOpenModal={openModal} />
  } else if (role === 'sales') {
    content = <SalesDashboard />
  } else if (role === 'development') {
    if (activeSection === 'overview') {
      content = (
        <DevelopmentDashboard
          onOpenModal={openModal}
          currentUserName={user.name}
          currentUserEmail={user.email}
        />
      )
    }
    if (activeSection === 'devTasks') {
      content = <DevTasksPage />
    }
    if (activeSection === 'devPayroll') {
      content = <DevPayrollPage />
    }
    if (activeSection === 'devProjects') {
      content = <DevProjectsPage />
    }
  }

  const portalName = portal === 'rnxa' ? 'RNXA' : 'Amenityforge'
  const roleLabelMap: Record<UserRole, string> = {
    admin: 'Admin',
    sales: 'Sales',
    development: 'Development',
  }

  return (
    <div className="dashboard-root">
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'is-open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <Sidebar
        currentRole={role}
        portal={portal}
        activeSection={activeSection}
        onChangeSection={handleSectionChange}
        onOpenModal={openModal}
        onSwitchPortal={() => {
          onSwitchPortal()
          setIsMobileMenuOpen(false)
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      <div className="dashboard-main">
        <Topbar
          userName={user.name}
          userEmail={user.email}
          portal={portal}
          onLogout={onLogout}
          theme={theme}
          onToggleTheme={onToggleTheme}
          title={`${portalName} · ${roleLabelMap[role]} Dashboard`}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateToSection={handleSectionChange}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          userRole={role}
        />
        <div className="dashboard-inner">
          <RoleActionsBar role={role} portal={portal} onOpenModal={openModal} />
          <main className="dashboard-content">{content}</main>
        </div>
      </div>

      {activeModal && <Modal type={activeModal} onClose={closeModal} />}
    </div>
  )
}
