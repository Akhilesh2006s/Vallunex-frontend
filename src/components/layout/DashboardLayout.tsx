import type { ReactNode } from 'react'
import type { User, UserRole } from '../../App'
import { AdminDashboard } from '../../pages/AdminDashboard'
import { SalesDashboard } from '../../pages/SalesDashboard'
import { DevelopmentDashboard } from '../../pages/DevelopmentDashboard'
import { EmployeesPage } from '../../pages/EmployeesPage'
import { ClientsPage } from '../../pages/ClientsPage'
import { ProjectsPage } from '../../pages/ProjectsPage'
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
  onLogout: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

type DashboardSection =
  | 'overview'
  | 'employees'
  | 'payroll'
  | 'clients'
  | 'projects'
  | 'devTasks'
  | 'devPayroll'
  | 'devProjects'

function RoleActionsBar({
  role,
  onOpenModal,
}: {
  role: UserRole
  onOpenModal: (type: ModalType) => void
}) {
  if (role === 'admin') {
    return (
      <div className="page-actions-row">
        <div>
          <h2 className="page-actions-title">Admin workspace</h2>
          <p className="page-actions-subtitle">
            High-level overview of company metrics, workload and deadlines. Use the sidebar for actions.
          </p>
        </div>
      </div>
    )
  }

  if (role === 'sales') {
    return (
      <div className="page-actions-row">
        <div>
          <h2 className="page-actions-title">Sales workspace</h2>
          <p className="page-actions-subtitle">Track pipeline, convert leads and stay on top of meetings.</p>
        </div>
        <div className="page-actions-buttons">
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addLead')}>
            + Add lead
          </button>
        </div>
      </div>
    )
  }

  if (role === 'development') {
    return (
      <div className="page-actions-row">
        <div>
          <h2 className="page-actions-title">Development workspace</h2>
          <p className="page-actions-subtitle">Submit links, review sprints and keep delivery on track.</p>
        </div>
        <div className="page-actions-buttons">
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addTask')}>
            + New internal task
          </button>
        </div>
      </div>
    )
  }

  return null
}

export function DashboardLayout({ user, onLogout, theme, onToggleTheme }: DashboardLayoutProps) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  const role = user.role

  const openModal = (type: ModalType) => setActiveModal(type)
  const closeModal = () => setActiveModal(null)

  let content: ReactNode = null

  if (role === 'admin') {
    if (activeSection === 'overview') content = <AdminDashboard onOpenModal={openModal} />
    if (activeSection === 'employees') content = <EmployeesPage onOpenModal={openModal} />
    if (activeSection === 'payroll') content = <PayrollPage />
    if (activeSection === 'clients') content = <ClientsPage />
    if (activeSection === 'projects') content = <ProjectsPage onOpenModal={openModal} />
  } else if (role === 'sales') {
    content = <SalesDashboard onOpenModal={openModal} />
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
      content = (
        <DevTasksPage
          onOpenModal={openModal}
          currentUserName={user.name}
          currentUserEmail={user.email}
        />
      )
    }
    if (activeSection === 'devPayroll') {
      content = <DevPayrollPage currentUserName={user.name} currentUserEmail={user.email} />
    }
    if (activeSection === 'devProjects') {
      content = <DevProjectsPage currentUserName={user.name} currentUserEmail={user.email} />
    }
  }

  const roleLabelMap: Record<UserRole, string> = {
    admin: 'Admin',
    sales: 'Sales',
    development: 'Development',
  }

  return (
    <div className="dashboard-root">
      <Sidebar
        currentRole={role}
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        onOpenModal={openModal}
      />
      <div className="dashboard-main">
        <Topbar
          userName={user.name}
          userEmail={user.email}
          onLogout={onLogout}
          theme={theme}
          onToggleTheme={onToggleTheme}
          title={`${roleLabelMap[role]} Dashboard`}
        />
        <div className="dashboard-inner">
          <RoleActionsBar role={role} onOpenModal={openModal} />
          <main className="dashboard-content">{content}</main>
        </div>
      </div>

      {activeModal && <Modal type={activeModal} onClose={closeModal} />}
    </div>
  )
}

 