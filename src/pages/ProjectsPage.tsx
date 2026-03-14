import { useState, type FormEvent } from 'react'
import { useAppData, type ProjectStatus } from '../state/AppDataContext'
import type { ModalType } from '../components/modals/Modal'

type ProjectsPageProps = {
  onOpenModal: (type: ModalType) => void
}

export function ProjectsPage({ onOpenModal }: ProjectsPageProps) {
  const { employees, projects, tasks, addProject, updateProject, deleteProject } = useAppData()

  const [formState, setFormState] = useState({
    name: '',
    clientName: '',
    status: 'Planned' as ProjectStatus,
    budget: '',
    ownerEmployeeId: employees[0]?.id ?? '',
  })

  const [filterStatus, setFilterStatus] = useState<'All' | ProjectStatus>('All')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.name || !formState.clientName || !formState.ownerEmployeeId) return

    const numericBudget = formState.budget ? Number(formState.budget) : undefined
    await addProject({
      name: formState.name,
      clientName: formState.clientName,
      status: formState.status,
      budget: numericBudget,
      ownerEmployeeId: formState.ownerEmployeeId,
    })
    setFormState((prev) => ({ ...prev, name: '', clientName: '', budget: '' }))
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === 'Planned' || p.status === 'In Progress').length
  const completedProjects = projects.filter((p) => p.status === 'Completed').length

  const filteredProjects = filterStatus === 'All'
    ? projects
    : projects.filter((p) => p.status === filterStatus)

  // Link tasks to projects
  const getProjectTasks = (projectId: string) => tasks.filter((t) => t.projectId === projectId)

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>Projects</h2>
            <p className="card-subtitle">
              Assign projects to employees, track budgets, and link related tasks.
            </p>
          </div>
          <div className="page-actions-buttons">
            <button type="button" className="primary-button sm" onClick={() => onOpenModal('addTask')}>
              + Add Related Task
            </button>
          </div>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">{totalProjects}</div>
            <div className="stat-meta">Across all teams</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-value">{activeProjects}</div>
            <div className="stat-meta positive">Planned & in progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completedProjects}</div>
            <div className="stat-meta positive">Delivered</div>
          </div>
        </div>
      </section>

      {/* Project List */}
      <section className="card span-3">
        <div className="card-header with-actions">
          <h2>Project List</h2>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'All' | ProjectStatus)}
          >
            <option value="All">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
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
                <th>Tasks</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const projectTasks = getProjectTasks(project.id)
                return (
                  <tr key={project.id}>
                    <td style={{ fontWeight: 600 }}>{project.name}</td>
                    <td>{project.clientName}</td>
                    <td>{project.ownerEmployeeName}</td>
                    <td>
                      <select
                        className="filter-select"
                        value={project.status}
                        onChange={(e) => void updateProject(project.id, { status: e.target.value as ProjectStatus })}
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      {typeof project.budget === 'number'
                        ? project.budget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                        : '—'}
                    </td>
                    <td>
                      {projectTasks.length > 0 ? (
                        <span className="pill pill-info">{projectTasks.length} task{projectTasks.length > 1 ? 's' : ''}</span>
                      ) : (
                        <span className="list-meta">None</span>
                      )}
                    </td>
                    <td className="table-actions-col">
                      <button
                        type="button"
                        className="link-button danger"
                        onClick={() => {
                          if (window.confirm(`Remove project "${project.name}"?`)) void deleteProject(project.id)
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📁</div>
                      <div className="empty-state-title">No projects found</div>
                      <div className="empty-state-text">Create a new project to get started.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Project Form */}
      <section className="card span-1">
        <div className="card-header">
          <h2>New Project</h2>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="project-name">Project Name</label>
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
          <div className="field-group">
            <label htmlFor="project-owner">Assign To</label>
            <select
              id="project-owner"
              value={formState.ownerEmployeeId}
              onChange={(e) => setFormState((prev) => ({ ...prev, ownerEmployeeId: e.target.value }))}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="project-status">Status</label>
              <select
                id="project-status"
                value={formState.status}
                onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="project-budget">Budget (₹)</label>
              <input
                id="project-budget"
                type="number"
                min="0"
                value={formState.budget}
                onChange={(e) => setFormState((prev) => ({ ...prev, budget: e.target.value }))}
                placeholder="100000"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="primary-button sm">
              Create Project
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
