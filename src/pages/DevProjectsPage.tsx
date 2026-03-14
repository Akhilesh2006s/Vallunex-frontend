import { useAppData } from '../state/AppDataContext'

export function DevProjectsPage() {
  const { projects, tasks } = useAppData()

  const getProjectTasks = (projectId: string) => tasks.filter((t) => t.projectId === projectId)

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>My Projects</h2>
          <p className="card-subtitle">Projects you are involved in and their linked tasks.</p>
        </div>
      </section>

      {projects.map((project) => {
        const projectTasks = getProjectTasks(project.id)
        return (
          <section key={project.id} className="card span-2">
            <div className="card-header with-actions">
              <div>
                <h2>{project.name}</h2>
                <p className="card-subtitle">{project.clientName} • {project.ownerEmployeeName}</p>
              </div>
              <span className={`pill ${project.status === 'Completed' ? 'pill-success' : project.status === 'In Progress' ? 'pill-info' : project.status === 'On Hold' ? 'pill-warning' : ''}`}>
                {project.status}
              </span>
            </div>
            <div className="overview-grid three" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <div className="stat-label">Budget</div>
                <div className="stat-value">
                  {typeof project.budget === 'number'
                    ? project.budget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                    : '—'}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Tasks</div>
                <div className="stat-value">{projectTasks.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{projectTasks.filter((t) => t.status === 'Approved').length}</div>
              </div>
            </div>
            {projectTasks.length > 0 && (
              <div className="card-list">
                {projectTasks.map((task) => (
                  <div key={task.id} className="card-list-item">
                    <div className="card-list-item-info">
                      <span className="card-list-item-title">{task.title}</span>
                      <span className="list-meta">{task.assignedTo} • Due {task.deadline}</span>
                    </div>
                    <span className={`pill ${task.status === 'Approved' ? 'pill-success' : task.status === 'Submitted' ? 'pill-info' : task.status === 'Rejected' ? 'pill-danger' : ''}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}

      {projects.length === 0 && (
        <section className="card span-4">
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <div className="empty-state-title">No projects assigned</div>
            <div className="empty-state-text">You'll see your projects here once assigned.</div>
          </div>
        </section>
      )}
    </div>
  )
}
