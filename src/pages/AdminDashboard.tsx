import type { ModalType } from '../components/modals/Modal'
import { useAppData } from '../state/AppDataContext'
import { AdminOverviewCharts } from '../components/charts/AdminOverviewCharts'

type AdminDashboardProps = {
  onOpenModal: (type: ModalType) => void
}

export function AdminDashboard({ onOpenModal: _onOpenModal }: AdminDashboardProps) {
  const { employees, tasks, leads, approveTask, rejectTask } = useAppData()

  const totalEmployees = employees.length
  const pendingCount = employees.filter((emp) => emp.status === 'Pending').length
  const totalRevenue = leads
    .filter((lead) => lead.status === 'Client')
    .reduce((sum, lead) => sum + lead.value, 0)
  const openTasks = tasks.filter((task) => task.status === 'Open').length
  const submittedTasks = tasks.filter((task) => task.status === 'Submitted').length
  const approvedTasks = tasks.filter((task) => task.status === 'Approved').length
  const submittedTaskList = tasks.filter((task) => task.status === 'Submitted')
  const allTasks = tasks

  const highPriorityTasks = tasks
    .filter((task) => task.priority === 'High')
    .slice(0, 3)
  const upcomingTasks = (highPriorityTasks.length > 0 ? highPriorityTasks : tasks).slice(0, 5)

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>Company Overview</h2>
        </div>
        <div className="overview-grid">
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">
              {totalRevenue.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="stat-meta positive">From all converted clients (live)</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Employees</div>
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-meta">Live headcount</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Sales Leads</div>
            <div className="stat-value">{leads.length}</div>
            <div className="stat-meta">Live pipeline from Sales</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Payroll Status</div>
            <div className="stat-value">{pendingCount} Pending</div>
            <div className="stat-meta">Updated as you approve payroll</div>
          </div>
        </div>
        <AdminOverviewCharts tasks={tasks} leads={leads} />
      </section>

      <section className="card span-4">
        <div className="card-header">
          <h2>Assigned Action Items (all employees)</h2>
          <p className="card-subtitle">Every task created for employees, with status and due dates.</p>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Due date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.deadline}</td>
                  <td>
                    <span
                      className={`pill ${
                        task.priority === 'High'
                          ? 'pill-danger'
                          : task.priority === 'Medium'
                            ? 'pill-warning'
                            : ''
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`pill ${
                        task.status === 'Approved'
                          ? 'pill-success'
                          : task.status === 'Submitted'
                            ? 'pill-warning'
                            : task.status === 'Rejected'
                              ? 'pill-danger'
                              : ''
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.submissionLink ? (
                      <a
                        href={task.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="link-button"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="list-meta">No link</span>
                    )}
                  </td>
                </tr>
              ))}
              {allTasks.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <span className="list-meta">No tasks created yet.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-3">
        <div className="card-header">
          <h2>Workload Snapshot</h2>
          <p className="card-subtitle">Open vs submitted vs approved work across all teams.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Open tasks</div>
            <div className="stat-value">{openTasks}</div>
            <div className="stat-meta">Items still in progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Submitted</div>
            <div className="stat-value">{submittedTasks}</div>
            <div className="stat-meta">Waiting for review</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{approvedTasks}</div>
            <div className="stat-meta positive">Signed off by Admin</div>
          </div>
        </div>
      </section>

      <section className="card span-3">
        <div className="card-header">
          <h2>Pending Task Reviews</h2>
          <p className="card-subtitle">Submitted links from employees waiting for Admin approval.</p>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Link</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {submittedTaskList.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    {task.submissionLink ? (
                      <a
                        href={task.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="link-button"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="list-meta">No link</span>
                    )}
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button strong"
                      onClick={() => {
                        void approveTask(task.id)
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm('Reject this submission?')
                        if (!ok) return
                        void rejectTask(task.id)
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {submittedTaskList.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <span className="list-meta">No submitted tasks waiting for review.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header with-actions">
          <h2>Notifications</h2>
        </div>
        <ul className="list">
          <li>
            <div className="list-title">Payroll batch ready for approval</div>
            <div className="list-meta">10 min ago</div>
          </li>
          <li>
            <div className="list-title">New employee onboarding request</div>
            <div className="list-meta">1 hour ago</div>
          </li>
          <li>
            <div className="list-title">Sprint review meeting at 3 PM</div>
            <div className="list-meta">2 hours ago</div>
          </li>
          <li>
            <div className="list-title">Server maintenance scheduled tonight</div>
            <div className="list-meta">1 day ago</div>
          </li>
        </ul>
      </section>

      <section className="card span-3">
        <div className="card-header">
          <h2>Upcoming Deadlines</h2>
          <p className="card-subtitle">High-priority work and project dates.</p>
        </div>
        <ul className="list">
          {upcomingTasks.map((task) => (
            <li key={task.id}>
              <div className="list-title">{task.title}</div>
              <div className="list-meta">
                {task.deadline} • {task.assignedTo} • {task.priority} priority • {task.status}
              </div>
            </li>
          ))}
          {upcomingTasks.length === 0 && (
            <li>
              <div className="list-meta">
                No tasks yet. New tasks created by other dashboards will appear here automatically.
              </div>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}


