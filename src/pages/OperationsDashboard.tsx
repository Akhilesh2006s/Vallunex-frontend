import { useAppData } from '../state/AppDataContext'

export function OperationsDashboard() {
  const { employees } = useAppData()
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const pendingPayroll = employees.filter((emp) => emp.status === 'Pending').reduce((sum, emp) => sum + emp.salary, 0)

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>Daily Operations Summary</h2>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">On-time Tasks</div>
            <div className="stat-value">89%</div>
            <div className="stat-meta positive">+6% vs last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Teams Online</div>
            <div className="stat-value">4 / 5</div>
            <div className="stat-meta">Operations, Support, Finance, HR</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Incidents</div>
            <div className="stat-value">2</div>
            <div className="stat-meta">Both low impact</div>
          </div>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header with-actions">
          <div>
            <h2>Team Attendance</h2>
            <p className="card-subtitle">Simple attendance view (UI only).</p>
          </div>
          <select className="filter-select" defaultValue="today">
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Team</th>
                <th>Status</th>
                <th>Check-in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Emma Stone</td>
                <td>Operations</td>
                <td>
                  <span className="pill pill-success">Present</span>
                </td>
                <td>09:01</td>
              </tr>
              <tr>
                <td>Liam Park</td>
                <td>Support</td>
                <td>
                  <span className="pill pill-success">Present</span>
                </td>
                <td>08:55</td>
              </tr>
              <tr>
                <td>Ava Rossi</td>
                <td>Finance</td>
                <td>
                  <span className="pill pill-warning">Remote</span>
                </td>
                <td>09:10</td>
              </tr>
              <tr>
                <td>Noah Singh</td>
                <td>HR</td>
                <td>
                  <span className="pill">On Leave</span>
                </td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Resource Management</h2>
        </div>
        <ul className="list">
          <li>
            <div className="list-title">Meeting rooms</div>
            <div className="list-meta">3 / 8 available</div>
          </li>
          <li>
            <div className="list-title">Company vehicles</div>
            <div className="list-meta">2 in use • 1 in maintenance</div>
          </li>
          <li>
            <div className="list-title">Hardware pool</div>
            <div className="list-meta">6 laptops available for allocation</div>
          </li>
        </ul>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Payroll View (Read-only)</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Cycle</th>
                <th>Status</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All Time</td>
                <td>
                  <span className="pill pill-success">Processed + Pending</span>
                </td>
                <td>
                  {totalPayroll.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
              <tr>
                <td>Current Pending</td>
                <td>
                  <span className="pill pill-warning">Pending Review</span>
                </td>
                <td>
                  {pendingPayroll.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Action Items</h2>
        </div>
        <ul className="list">
          <li>
            <div className="list-title">Confirm vendor maintenance slots</div>
            <div className="list-meta">Due today • Owner: Ops</div>
          </li>
          <li>
            <div className="list-title">Publish weekly operations summary</div>
            <div className="list-meta">Due tomorrow • Owner: Ops Coordinator</div>
          </li>
          <li>
            <div className="list-title">Reconcile staff attendance</div>
            <div className="list-meta">Due Friday • Owner: HR</div>
          </li>
        </ul>
      </section>
    </div>
  )
}


