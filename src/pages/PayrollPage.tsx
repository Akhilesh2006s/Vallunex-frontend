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
  const paidAmount = totalPayroll - pendingAmount

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Payroll Management</h2>
            <p className="card-subtitle">Track salaries, approval status and process payroll batches.</p>
          </div>
          {pendingEmployees.length > 0 && (
            <button type="button" className="primary-button sm success" onClick={() => void approveAllPayroll()}>
              ✓ Approve All Pending ({pendingEmployees.length})
            </button>
          )}
        </div>
        <div className="overview-grid">
          <div className="stat-card">
            <div className="stat-label">Total Payroll</div>
            <div className="stat-value">
              {totalPayroll.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta">Monthly obligation</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Amount</div>
            <div className="stat-value">
              {pendingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta">Awaiting approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Processed</div>
            <div className="stat-value">
              {paidAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta positive">Already paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Headcount</div>
            <div className="stat-value">{pendingEmployees.length}</div>
            <div className="stat-meta">of {employees.length} employees</div>
          </div>
        </div>
      </section>

      <section className="card span-4">
        <div className="card-header">
          <h2>Payroll Details (Monthly)</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Monthly Salary</th>
                <th>Status</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td><span className="pill pill-info">{emp.role}</span></td>
                  <td>
                    {editingId === emp.id ? (
                      <div className="inline-edit">
                        <input
                          type="number"
                          min={0}
                          className="form-select"
                          style={{ maxWidth: 140, padding: '6px 10px' }}
                          value={editingSalary}
                          onChange={(e) => setEditingSalary(e.target.value)}
                          autoFocus
                        />
                        <div className="inline-edit-actions">
                          <button type="button" className="link-button strong" onClick={() => void handleSaveEdit()}>
                            Save
                          </button>
                          <button type="button" className="link-button" onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="inline-read">
                        <span>
                          {emp.salary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </span>
                        <button type="button" className="link-button" onClick={() => handleStartEdit(emp.id, emp.salary)}>
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
                    {emp.status === 'Pending' ? (
                      <button type="button" className="link-button strong" onClick={() => void approveEmployee(emp.id)}>
                        Mark Paid
                      </button>
                    ) : (
                      <span className="list-meta">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-state-icon">💰</div>
                      <div className="empty-state-title">No employees</div>
                      <div className="empty-state-text">Add team members to manage payroll.</div>
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
