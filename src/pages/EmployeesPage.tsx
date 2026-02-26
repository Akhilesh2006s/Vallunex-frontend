import type { ModalType } from '../components/modals/Modal'
import { useAppData } from '../state/AppDataContext'

type EmployeesPageProps = {
  onOpenModal: (type: ModalType) => void
}

export function EmployeesPage({ onOpenModal }: EmployeesPageProps) {
  const { employees, approveEmployee: _approveEmployee, updateEmployee: _updateEmployee, deleteEmployee } = useAppData()

  const totalEmployees = employees.length
  const pendingCount = employees.filter((emp) => emp.status === 'Pending').length

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Employees</h2>
            <p className="card-subtitle">Manage your organisation&apos;s people in one clean view.</p>
          </div>
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addEmployee')}>
            + Add employee
          </button>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Total employees</div>
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-meta">Live headcount</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending payroll</div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-meta">Awaiting approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Paid</div>
            <div className="stat-value">{totalEmployees - pendingCount}</div>
            <div className="stat-meta positive">Processed this cycle</div>
          </div>
        </div>
      </section>

      <section className="card span-4">
        <div className="card-header">
          <h2>Employee directory</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email ?? '—'}</td>
                  <td>{emp.role}</td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm(`Remove ${emp.name} from employees?`)
                        if (!ok) return
                        void deleteEmployee(emp.id)
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

