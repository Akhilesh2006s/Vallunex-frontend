import { useAppData } from '../state/AppDataContext'

export function DevTasksPage() {
  const { tasks, updateTask } = useAppData()

  const openTasks = tasks.filter((t) => t.status === 'Open' || t.status === 'Rejected')
  const submittedTasks = tasks.filter((t) => t.status === 'Submitted')
  const approvedTasks = tasks.filter((t) => t.status === 'Approved')

  return (
    <div className="page-grid">
      {/* Open / In-progress tasks */}
      <section className="card span-4">
        <div className="card-header">
          <h2>My Tasks</h2>
          <p className="card-subtitle">
            Submit completed tasks for review. Your admin will approve or send back for revisions.
          </p>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Open Tasks ({openTasks.length})</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openTasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 500 }}>{task.title}</td>
                  <td>
                    <span className={`pill ${task.priority === 'High' ? 'pill-danger' : task.priority === 'Medium' ? 'pill-warning' : ''}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.deadline}</td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="primary-button sm"
                      onClick={() => void updateTask(task.id, { status: 'Submitted' })}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
              {openTasks.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-state-icon">🎉</div><div className="empty-state-title">All caught up!</div><div className="empty-state-text">No open tasks.</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Submitted ({submittedTasks.length})</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submittedTasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 500 }}>{task.title}</td>
                  <td><span className={`pill ${task.priority === 'High' ? 'pill-danger' : task.priority === 'Medium' ? 'pill-warning' : ''}`}>{task.priority}</span></td>
                  <td>{task.deadline}</td>
                  <td><span className="pill pill-info">Pending Review</span></td>
                </tr>
              ))}
              {submittedTasks.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-state-icon">📬</div><div className="empty-state-title">Nothing submitted</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Approved Tasks */}
      <section className="card span-4">
        <div className="card-header">
          <h2>✅ Approved ({approvedTasks.length})</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedTasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 500 }}>{task.title}</td>
                  <td><span className={`pill ${task.priority === 'High' ? 'pill-danger' : task.priority === 'Medium' ? 'pill-warning' : ''}`}>{task.priority}</span></td>
                  <td>{task.deadline}</td>
                  <td><span className="pill pill-success">Approved</span></td>
                </tr>
              ))}
              {approvedTasks.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No approved tasks yet</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
