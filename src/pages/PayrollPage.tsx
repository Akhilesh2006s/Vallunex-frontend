import { useState } from 'react'
import { useAppData } from '../state/AppDataContext'

export function PayrollPage() {
  const { employees, approveEmployee, approveAllPayroll, updateEmployee } = useAppData()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingSalary, setEditingSalary] = useState<string>('')

  const handleStartEdit = (id: string, currentSalary: number) => {
    setEditingId(id)
    setEditingSalary(String(currentSalary))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingSalary('')
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    const parsed = Number(editingSalary)
    if (Number.isNaN(parsed) || parsed < 0) {
      // Simple client-side guard; backend still owns final validation.
      window.alert('Enter a valid monthly salary amount.')
      return
    }

    await updateEmployee(editingId, { salary: parsed })
    setEditingId(null)
    setEditingSalary('')
  }

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const pendingEmployees = employees.filter((emp) => emp.status === 'Pending')
  const pendingAmount = pendingEmployees.reduce((sum, emp) => sum + emp.salary, 0)

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Payroll Overview</h2>
            <p className="card-subtitle">Live view of salary obligations and approval status.</p>
          </div>
          {pendingEmployees.length > 0 && (
            <button
              type="button"
              className="primary-button sm"
              onClick={() => {
                void approveAllPayroll()
              }}
            >
              Approve all pending
            </button>
          )}
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Total payroll</div>
            <div className="stat-value">
              {totalPayroll.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="stat-meta">All employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending amount</div>
            <div className="stat-value">
              {pendingAmount.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="stat-meta">Awaiting approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending employees</div>
            <div className="stat-value">{pendingEmployees.length}</div>
            <div className="stat-meta">Will be marked paid on approval</div>
          </div>
        </div>
      </section>

      <section className="card span-4">
        <div className="card-header">
          <h2>Payroll details (monthly)</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Monthly salary</th>
                <th>Status</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>
                    {editingId === emp.id ? (
                      <div className="inline-edit">
                        <input
                          type="number"
                          min={0}
                          className="form-select"
                          value={editingSalary}
                          onChange={(e) => setEditingSalary(e.target.value)}
                        />
                        <div className="inline-edit-actions">
                          <button
                            type="button"
                            className="link-button strong"
                            onClick={() => {
                              void handleSaveEdit()
                            }}
                          >
                            Save
                          </button>
                          <button type="button" className="link-button" onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="inline-read">
                        <div>
                          {emp.salary.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => handleStartEdit(emp.id, emp.salary)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`pill ${emp.status === 'Paid' ? 'pill-success' : 'pill-warning'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="table-actions-col">
                    {emp.status === 'Pending' && (
                      <button
                        type="button"
                        className="link-button strong"
                        onClick={() => {
                          void approveEmployee(emp.id)
                        }}
                      >
                        Mark paid
                      </button>
                    )}
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

