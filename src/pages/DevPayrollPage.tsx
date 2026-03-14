import { useAppData } from '../state/AppDataContext'

export function DevPayrollPage() {
  const { employees } = useAppData()

  // In a real app, we would filter for just the current user's payroll. For now show all.
  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>My Payroll</h2>
          <p className="card-subtitle">View your salary details and payment status.</p>
        </div>
      </section>

      <section className="card span-4">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Monthly Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td><span className="pill pill-info">{emp.role}</span></td>
                  <td>
                    {emp.salary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </td>
                  <td>
                    <span className={`pill ${emp.status === 'Paid' ? 'pill-success' : 'pill-warning'}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-state-icon">💰</div><div className="empty-state-title">No payroll data</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
