import type { ModalType } from '../components/modals/Modal'
import type { CompanyPortal } from '../App'
import { useAppData } from '../state/AppDataContext'
import { AdminOverviewCharts } from '../components/charts/AdminOverviewCharts'

type AdminDashboardProps = {
  onOpenModal: (type: ModalType) => void
  portal: CompanyPortal
}

export function AdminDashboard({ onOpenModal, portal }: AdminDashboardProps) {
  const { employees, tasks, leads, products, projects, approveTask, rejectTask } = useAppData()

  const portalName = portal === 'rnxa' ? 'RNXA' : 'Amenityforge'
  const totalEmployees = employees.length
  const pendingCount = employees.filter((emp) => emp.status === 'Pending').length
  const totalRevenue = leads
    .filter((lead) => lead.status === 'Client')
    .reduce((sum, lead) => sum + lead.value, 0)
  // Filter out tasks without IDs to prevent rendering issues
  const validTasks = tasks.filter((task) => task.id)
  const openTasks = validTasks.filter((task) => task.status === 'Open').length
  const submittedTasks = validTasks.filter((task) => task.status === 'Submitted').length
  const approvedTasks = validTasks.filter((task) => task.status === 'Approved').length
  const submittedTaskList = validTasks.filter((task) => task.status === 'Submitted')
  const allTasks = validTasks

  const highPriorityTasks = validTasks
    .filter((task) => task.priority === 'High')
    .slice(0, 3)
  const upcomingTasks = (highPriorityTasks.length > 0 ? highPriorityTasks : validTasks).slice(0, 5)

  return (
    <div className="page-grid">
      {/* Company Overview */}
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>{portalName} Overview</h2>
            <p className="card-subtitle">Live company metrics updated in real-time from all departments.</p>
          </div>
          <div className="page-actions-buttons">
            <button type="button" className="primary-button sm" onClick={() => onOpenModal('addProject')}>
              + New Project
            </button>
          </div>
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
            <div className="stat-meta positive">From {leads.filter((l) => l.status === 'Client').length} converted clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Team Size</div>
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-meta">Active headcount</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Products</div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-meta">In catalogue</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Payroll Status</div>
            <div className="stat-value">{pendingCount} Pending</div>
            <div className="stat-meta">{totalEmployees - pendingCount} processed</div>
          </div>
        </div>
        <AdminOverviewCharts tasks={tasks} leads={leads} />
      </section>

      {/* Quick Stats Row */}
      <section className="card span-2">
        <div className="card-header">
          <h2>Workload Snapshot</h2>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Open</div>
            <div className="stat-value">{openTasks}</div>
            <div className="stat-meta">In progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Submitted</div>
            <div className="stat-value">{submittedTasks}</div>
            <div className="stat-meta">Awaiting review</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{approvedTasks}</div>
            <div className="stat-meta positive">Completed</div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="card span-2">
        <div className="card-header">
          <h2>Upcoming Deadlines</h2>
          <p className="card-subtitle">High-priority items first.</p>
        </div>
        {upcomingTasks.length > 0 ? (
          <ul className="list">
            {upcomingTasks.map((task) => (
              <li key={task.id}>
                <div className="list-title">{task.title}</div>
                <div className="list-meta">
                  {task.deadline} · {task.assignedTo} ·{' '}
                  <span className={task.priority === 'High' ? 'pill pill-danger' : task.priority === 'Medium' ? 'pill pill-warning' : 'pill'} style={{ display: 'inline', padding: '1px 6px', fontSize: 10 }}>
                    {task.priority}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No tasks yet</div>
            <div className="empty-state-text">Create tasks and they'll appear here.</div>
          </div>
        )}
      </section>

      {/* Pending Reviews */}
      <section className="card span-2">
        <div className="card-header">
          <h2>Pending Task Reviews</h2>
          <p className="card-subtitle">Submitted work waiting for your approval.</p>
        </div>
        <div className="table-wrapper">
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Task</th>
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
                      <a href={task.submissionLink} target="_blank" rel="noreferrer" className="link-button">
                        Open ↗
                      </a>
                    ) : (
                      <span className="list-meta">—</span>
                    )}
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button strong"
                      onClick={() => {
                        if (task.id) void approveTask(task.id)
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="link-button danger"
                      onClick={() => {
                        if (task.id && window.confirm('Reject this submission?')) void rejectTask(task.id)
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {submittedTaskList.length === 0 && (
                <tr key="empty-submitted">
                  <td colSpan={4}>
                    <span className="list-meta">No pending reviews</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notifications */}
      <section className="card span-2">
        <div className="card-header">
          <h2>Activity Feed</h2>
        </div>
        <ul className="list">
          {submittedTasks > 0 && (
            <li key="submitted-tasks">
              <div className="list-title">{submittedTasks} task{submittedTasks > 1 ? 's' : ''} submitted for review</div>
              <div className="list-meta">Needs your attention</div>
            </li>
          )}
          {pendingCount > 0 && (
            <li key="pending-payroll">
              <div className="list-title">Payroll batch ready ({pendingCount} pending)</div>
              <div className="list-meta">Go to Payroll to approve</div>
            </li>
          )}
          <li key="projects">
            <div className="list-title">{projects.length} project{projects.length !== 1 ? 's' : ''} tracked</div>
            <div className="list-meta">{projects.filter((p) => p.status === 'In Progress').length} in progress</div>
          </li>
          <li key="leads">
            <div className="list-title">Sales pipeline: {leads.length} lead{leads.length !== 1 ? 's' : ''}</div>
            <div className="list-meta">{leads.filter((l) => l.status === 'Client').length} converted to clients</div>
          </li>
        </ul>
      </section>

      {/* All Tasks */}
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>All Action Items</h2>
            <p className="card-subtitle">Complete list of tasks across all employees.</p>
          </div>
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addTask')}>
            + Assign Task
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 500 }}>{task.title}</td>
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
                            ? 'pill-info'
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
                      <a href={task.submissionLink} target="_blank" rel="noreferrer" className="link-button">
                        Open ↗
                      </a>
                    ) : (
                      <span className="list-meta">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {allTasks.length === 0 && (
                <tr key="empty-tasks">
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <div className="empty-state-title">No tasks created yet</div>
                      <div className="empty-state-text">Click "Assign Task" to get started.</div>
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
