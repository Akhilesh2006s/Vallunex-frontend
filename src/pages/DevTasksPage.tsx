import type { ModalType } from '../components/modals/Modal'
import { useAppData } from '../state/AppDataContext'
import { useEffect, useState } from 'react'

type DevTasksPageProps = {
  onOpenModal: (type: ModalType) => void
  currentUserName?: string
  currentUserEmail?: string
}

export function DevTasksPage({ onOpenModal, currentUserName, currentUserEmail }: DevTasksPageProps) {
  const { employees, tasks, submitTask } = useAppData()
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

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header with-actions">
          <div>
            <h2>My tasks</h2>
            <p className="card-subtitle">Tasks assigned by Admin, with links back to your work.</p>
          </div>
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
    </div>
  )
}

