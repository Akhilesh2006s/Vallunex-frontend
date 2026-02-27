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

  // Filters
  const [filterRole, setFilterRole] = useState<string>('All')
  const [filterPayroll, setFilterPayroll] = useState<'All' | 'Paid' | 'Pending'>('All')
  const [filterSearch, setFilterSearch] = useState('')

  const filteredEmployees = employees.filter((emp) => {
    if (filterRole !== 'All' && emp.role !== filterRole) return false
    if (filterPayroll !== 'All' && emp.status !== filterPayroll) return false
    if (
      filterSearch &&
      !`${emp.name} ${emp.email || ''}`.toLowerCase().includes(filterSearch.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Team members</h2>
            <p className="card-subtitle">Manage your organisation&apos;s people in one clean view.</p>
          </div>
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addEmployee')}>
            + Add
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
        <div className="page-actions-buttons" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
          <input
            className="form-select"
            style={{ maxWidth: 220 }}
            placeholder="Search by name or email…"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All roles</option>
            {Array.from(new Set(employees.map((e) => e.role))).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filterPayroll}
            onChange={(e) => setFilterPayroll(e.target.value as 'All' | 'Paid' | 'Pending')}
          >
            <option value="All">All payroll statuses</option>
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
                <th>Products</th>
                <th>Projects</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email ?? '—'}</td>
                  <td>{emp.role}</td>
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
                      <option value="">Assign product…</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    {emp.productIds && emp.productIds.length > 0 && (
                      <div className="card-subtitle">
                        {(emp.productIds || [])
                          .map((id) => products.find((p) => p.id === id)?.name)
                          .filter(Boolean)
                          .join(', ')}
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
                      <option value="">Assign project…</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    {projects.some((project) => project.ownerEmployeeId === emp.id) && (
                      <div className="card-subtitle">
                        {projects
                          .filter((project) => project.ownerEmployeeId === emp.id)
                          .map((p) => p.name)
                          .join(', ')}
                      </div>
                    )}
                  </td>
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

