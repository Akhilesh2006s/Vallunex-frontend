import { useEffect, useState } from 'react'
import type { ModalType } from '../components/modals/Modal'
import { useAppData } from '../state/AppDataContext'

type DevelopmentDashboardProps = {
  onOpenModal: (type: ModalType) => void
  currentUserName?: string
  currentUserEmail?: string
}

export function DevelopmentDashboard({ onOpenModal, currentUserName, currentUserEmail }: DevelopmentDashboardProps) {
  const { employees, tasks, projects, submitTask } = useAppData()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')

  useEffect(() => {
    if ((!currentUserName && !currentUserEmail) || employees.length === 0) return

    setSelectedEmployeeId((prev) => {
      if (prev) return prev

      const matchByEmail = currentUserEmail
        ? employees.find((e) => e.email && e.email.toLowerCase() === currentUserEmail.toLowerCase())
        : undefined

      if (matchByEmail) return matchByEmail.id

      const matchByName = currentUserName ? employees.find((e) => e.name === currentUserName) : undefined
      return matchByName?.id ?? prev
    })
  }, [currentUserName, currentUserEmail, employees])

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) ?? null

  const visibleTasks =
    selectedEmployee == null
      ? tasks
      : tasks.filter((task) => task.assignedTo === selectedEmployee.name)

  const activeCount = visibleTasks.filter((t) => t.status === 'Open' || t.status === 'Submitted').length
  const completedCount = visibleTasks.filter((t) => t.status === 'Approved').length

  const myProjects =
    selectedEmployee == null
      ? []
      : projects.filter(
          (project) =>
            project.ownerEmployeeId === selectedEmployee.id ||
            project.ownerEmployeeName === selectedEmployee.name,
        )

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>Project Overview</h2>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Active Projects</div>
            <div className="stat-value">{activeCount}</div>
            <div className="stat-meta">Currently in progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed Projects</div>
            <div className="stat-value">{completedCount}</div>
            <div className="stat-meta positive">Delivered by the team</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Reviews</div>
            <div className="stat-value">
              {visibleTasks.filter((t) => t.status === 'Submitted').length}
            </div>
            <div className="stat-meta">Awaiting Admin approval</div>
          </div>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Sprint Board</h2>
        </div>
        <div className="kanban-grid">
          <div className="kanban-column">
            <div className="kanban-column-header">To Do</div>
            <div className="kanban-card">
              Implement SSO for partners
              <span className="kanban-meta">Sprint 14 • High</span>
            </div>
            <div className="kanban-card">
              API rate limiting review
              <span className="kanban-meta">Sprint 14 • Medium</span>
            </div>
          </div>
          <div className="kanban-column">
            <div className="kanban-column-header">In Progress</div>
            <div className="kanban-card">
              Mobile dashboard polish
              <span className="kanban-meta">Sprint 13 • High</span>
            </div>
            <div className="kanban-card">
              Error monitoring rollout
              <span className="kanban-meta">Sprint 13 • Medium</span>
            </div>
          </div>
          <div className="kanban-column">
            <div className="kanban-column-header">Completed</div>
            <div className="kanban-card is-done">
              Billing integration refactor
              <span className="kanban-meta">Sprint 12</span>
            </div>
            <div className="kanban-card is-done">
              CI/CD pipeline optimisation
              <span className="kanban-meta">Sprint 12</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header with-actions">
          <div>
            <h2>Assigned Action Items</h2>
            <p className="card-subtitle">
              Submit work links back to Admin. View tasks assigned only to employees created by Admin.
            </p>
          </div>
          <div className="page-actions-buttons">
            <select
              className="filter-select"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {/* Employees cannot create tasks themselves – tasks are assigned from Admin/Sales. */}
          </div>
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
              {visibleTasks.map((task) => (
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
                      <a href={task.submissionLink} target="_blank" rel="noreferrer" className="link-button">
                        Open
                      </a>
                    ) : task.status === 'Open' ? (
                      <button
                        type="button"
                        className="link-button strong"
                        onClick={() => {
                          const link = window.prompt('Paste the link to your work (PR, doc, URL)')
                          if (!link) return
                          void submitTask(task.id, link)
                        }}
                      >
                        Submit Link
                      </button>
                    ) : (
                      <span className="list-meta">
                        {task.status === 'Rejected' ? 'Rejected by Admin' : 'Waiting review'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>My Projects & Payroll</h2>
          <p className="card-subtitle">Quick view of your own projects and monthly salary.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Current salary</div>
            <div className="stat-value">
              {selectedEmployee
                ? selectedEmployee.salary.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  })
                : '—'}
            </div>
            <div className="stat-meta">
              {selectedEmployee ? `Payroll status: ${selectedEmployee.status}` : 'Select an employee above'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active projects</div>
            <div className="stat-value">{myProjects.length}</div>
            <div className="stat-meta">
              {myProjects.length > 0 ? 'Projects you own in the Projects dashboard.' : 'No projects assigned yet.'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Next due task</div>
            <div className="stat-value">
              {visibleTasks.length > 0 ? visibleTasks[0].deadline : '—'}
            </div>
            <div className="stat-meta">Sorted as they come back from the API.</div>
          </div>
        </div>
      </section>
    </div>
  )
}


