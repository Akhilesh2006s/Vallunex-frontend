import { useAppData } from '../state/AppDataContext'

type DevProjectsPageProps = {
  currentUserName?: string
  currentUserEmail?: string
}

export function DevProjectsPage({ currentUserName, currentUserEmail }: DevProjectsPageProps) {
  const { employees, projects } = useAppData()

  const me =
    employees.find(
      (e) => currentUserEmail && e.email && e.email.toLowerCase() === currentUserEmail.toLowerCase(),
    ) ?? employees.find((e) => currentUserName && e.name === currentUserName) ?? null

  const myProjects =
    me == null
      ? []
      : projects.filter(
          (project) => project.ownerEmployeeId === me.id || project.ownerEmployeeName === me.name,
        )

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>My projects</h2>
          <p className="card-subtitle">Projects where you are listed as the owner.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Active projects</div>
            <div className="stat-value">
              {myProjects.filter((p) => p.status === 'Planned' || p.status === 'In Progress').length}
            </div>
            <div className="stat-meta">Planned &amp; in progress.</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed projects</div>
            <div className="stat-value">{myProjects.filter((p) => p.status === 'Completed').length}</div>
            <div className="stat-meta positive">Marked as completed.</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">On hold</div>
            <div className="stat-value">{myProjects.filter((p) => p.status === 'On Hold').length}</div>
            <div className="stat-meta">Awaiting decisions or inputs.</div>
          </div>
        </div>
      </section>

      <section className="card span-4">
        <div className="card-header">
          <h2>Project list</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {myProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.clientName}</td>
                  <td>{project.status}</td>
                  <td>
                    {typeof project.budget === 'number'
                      ? project.budget.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
              {myProjects.length === 0 && (
                <tr>
                  <td colSpan={4}>No projects assigned to you yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

