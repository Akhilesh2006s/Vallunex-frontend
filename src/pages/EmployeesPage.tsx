import { useState } from 'react'
import type { ModalType } from '../components/modals/Modal'
import { useAppData } from '../state/AppDataContext'

type EmployeesPageProps = {
  onOpenModal: (type: ModalType) => void
}

export function EmployeesPage({ onOpenModal }: EmployeesPageProps) {
  const { employees, products, projects, updateEmployee, updateProject, deleteEmployee } = useAppData()

  const totalEmployees = employees.length
  const pendingCount = employees.filter((emp) => emp.status === 'Pending').length
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0)

  // Filters
  const [filterRole, setFilterRole] = useState<string>('All')
  const [filterPayroll, setFilterPayroll] = useState<'All' | 'Paid' | 'Pending'>('All')
  const [filterSearch, setFilterSearch] = useState('')

  const filteredEmployees = employees.filter((emp) => {
    if (filterRole !== 'All' && emp.role !== filterRole) return false
    if (filterPayroll !== 'All' && emp.status !== filterPayroll) return false
    if (filterSearch && !`${emp.name} ${emp.email || ''}`.toLowerCase().includes(filterSearch.toLowerCase())) return false
    return true
  })

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Team Members</h2>
            <p className="card-subtitle">Manage your organisation's people, products and project assignments.</p>
          </div>
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addEmployee')}>
            + Add Member
          </button>
        </div>
        <div className="overview-grid">
          <div className="stat-card">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-meta">Active headcount</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Payroll</div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-meta">Awaiting approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Processed</div>
            <div className="stat-value">{totalEmployees - pendingCount}</div>
            <div className="stat-meta positive">This cycle</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Payroll</div>
            <div className="stat-value">
              {totalSalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta">Monthly obligation</div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="card span-4">
        <div className="card-header">
          <h2>Employee Directory</h2>
        </div>
        <div className="page-actions-buttons" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <input
            className="form-select"
            style={{ maxWidth: 240, padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
            placeholder="Search by name or email..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
          <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="All">All roles</option>
            {Array.from(new Set(employees.map((e) => e.role))).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select className="filter-select" value={filterPayroll} onChange={(e) => setFilterPayroll(e.target.value as 'All' | 'Paid' | 'Pending')}>
            <option value="All">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Products</th>
                <th>Projects</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{emp.email ?? '—'}</td>
                  <td>
                    <span className="pill pill-info">{emp.role}</span>
                  </td>
                  <td>
                    {emp.salary > 0
                      ? emp.salary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                      : '—'}
                  </td>
                  <td>
                    <span className={`pill ${emp.status === 'Paid' ? 'pill-success' : 'pill-warning'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      value=""
                      onChange={(e) => {
                        const value = e.target.value
                        if (!value) return
                        const currentIds = emp.productIds ?? []
                        const nextIds = currentIds.includes(value) ? currentIds : [...currentIds, value]
                        void updateEmployee(emp.id, { productIds: nextIds })
                      }}
                    >
                      <option value="">Assign...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                    {emp.productIds && emp.productIds.length > 0 && (
                      <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(emp.productIds || []).map((id) => {
                          const product = products.find((p) => p.id === id)
                          if (!product) return null
                          return (
                            <span key={id} className="pill" style={{ gap: 4 }}>
                              {product.name}
                              <button
                                type="button"
                                className="link-button danger"
                                style={{ padding: '0 2px', fontSize: 14, lineHeight: 1 }}
                                onClick={() => {
                                  const nextIds = (emp.productIds || []).filter((pid) => pid !== id)
                                  void updateEmployee(emp.id, { productIds: nextIds })
                                }}
                              >
                                ×
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      value=""
                      onChange={(e) => {
                        const projectId = e.target.value
                        if (!projectId) return
                        void updateProject(projectId, { ownerEmployeeId: emp.id })
                      }}
                    >
                      <option value="">Assign...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                    {projects.some((project) => project.ownerEmployeeId === emp.id) && (
                      <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {projects
                          .filter((project) => project.ownerEmployeeId === emp.id)
                          .map((p) => (
                            <span key={p.id} className="pill" style={{ gap: 4 }}>
                              {p.name}
                              <button
                                type="button"
                                className="link-button danger"
                                style={{ padding: '0 2px', fontSize: 14, lineHeight: 1 }}
                                onClick={() => {
                                  const otherEmployees = employees.filter((e) => e.id !== emp.id)
                                  if (otherEmployees.length > 0) {
                                    const newOwner = otherEmployees[0]
                                    if (window.confirm(`Unassign "${p.name}" from ${emp.name}? Will be reassigned to ${newOwner.name}.`)) {
                                      void updateProject(p.id, { ownerEmployeeId: newOwner.id })
                                    }
                                  } else {
                                    window.alert('Cannot unassign: at least one employee must own this project.')
                                  }
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                      </div>
                    )}
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button danger"
                      onClick={() => {
                        if (window.confirm(`Remove ${emp.name} from the team?`)) {
                          void deleteEmployee(emp.id)
                        }
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <div className="empty-state-title">No team members found</div>
                      <div className="empty-state-text">Add team members to get started.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
