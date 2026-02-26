import { useState, type FormEvent } from 'react'
import { useAppData, type ProjectStatus } from '../state/AppDataContext'
import type { ModalType } from '../components/modals/Modal'

type ProjectsPageProps = {
  onOpenModal: (type: ModalType) => void
}

export function ProjectsPage({ onOpenModal }: ProjectsPageProps) {
  const { employees, projects, addProject, updateProject: _updateProject, deleteProject } = useAppData()

  const [formState, setFormState] = useState<{
    name: string
    clientName: string
    status: ProjectStatus
    budget: string
    ownerEmployeeId: string
  }>({
    name: '',
    clientName: '',
    status: 'Planned',
    budget: '',
    ownerEmployeeId: employees[0]?.id ?? '',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.name || !formState.clientName || !formState.ownerEmployeeId) {
      return
    }

    const numericBudget = formState.budget ? Number(formState.budget) : undefined

    await addProject({
      name: formState.name,
      clientName: formState.clientName,
      status: formState.status,
      budget: numericBudget,
      ownerEmployeeId: formState.ownerEmployeeId,
    })

    setFormState((prev) => ({
      ...prev,
      name: '',
      clientName: '',
      budget: '',
    }))
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === 'Planned' || p.status === 'In Progress').length

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Projects</h2>
            <p className="card-subtitle">
              Assign multiple projects to the same employee and keep ownership crystal clear.
            </p>
          </div>
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addTask')}>
            + Add related task
          </button>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Total projects</div>
            <div className="stat-value">{totalProjects}</div>
            <div className="stat-meta">Across all teams</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-value">{activeProjects}</div>
            <div className="stat-meta positive">Planned &amp; in progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Employees involved</div>
            <div className="stat-value">{new Set(projects.map((p) => p.ownerEmployeeId)).size}</div>
            <div className="stat-meta">Can own multiple projects each</div>
          </div>
        </div>
      </section>

      <section className="card span-3">
        <div className="card-header">
          <h2>Project list</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Budget</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.clientName}</td>
                  <td>{project.ownerEmployeeName}</td>
                  <td>
                    <span
                      className={`pill ${
                        project.status === 'Completed'
                          ? 'pill-success'
                          : project.status === 'On Hold'
                            ? 'pill-warning'
                            : ''
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>
                    {typeof project.budget === 'number'
                      ? project.budget.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        })
                      : '—'}
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm(`Remove project "${project.name}"?`)
                        if (!ok) return
                        void deleteProject(project.id)
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

      <section className="card span-1">
        <div className="card-header">
          <h2>Assign new project</h2>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="project-name">Project name</label>
            <input
              id="project-name"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Website redesign"
            />
          </div>
          <div className="field-group">
            <label htmlFor="project-client">Client</label>
            <input
              id="project-client"
              value={formState.clientName}
              onChange={(e) => setFormState((prev) => ({ ...prev, clientName: e.target.value }))}
              placeholder="Acme Corp"
            />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="project-owner">Assign to employee</label>
              <select
                id="project-owner"
                value={formState.ownerEmployeeId}
                onChange={(e) => setFormState((prev) => ({ ...prev, ownerEmployeeId: e.target.value }))}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="project-status">Status</label>
              <select
                id="project-status"
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))
                }
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="project-budget">Budget (optional)</label>
            <input
              id="project-budget"
              type="number"
              min="0"
              value={formState.budget}
              onChange={(e) => setFormState((prev) => ({ ...prev, budget: e.target.value }))}
              placeholder="100000"
            />
          </div>

          <div className="modal-footer">
            <button type="submit" className="primary-button sm">
              Assign project
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

