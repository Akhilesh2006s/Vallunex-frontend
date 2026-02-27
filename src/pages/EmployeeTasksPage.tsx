import { useState, type FormEvent } from 'react'
import { useAppData, type TaskPriority } from '../state/AppDataContext'

export function EmployeeTasksPage() {
  const { employees, tasks, addTask, updateTask, deleteTask } = useAppData()

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [deadline, setDeadline] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  // Filters
  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Submitted' | 'Approved' | 'Rejected'>('All')
  const [filterPriority, setFilterPriority] = useState<'All' | TaskPriority>('All')
  const [filterAssignee, setFilterAssignee] = useState<string>('All')

  const resetForm = () => {
    setTitle('')
    setPriority('Medium')
    setDeadline('')
    setEmployeeId('')
    setEditingTaskId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title || !deadline || !employeeId) return

    const assignedEmployee = employees.find((emp) => emp.id === employeeId)
    if (!assignedEmployee) return

    if (editingTaskId) {
      await updateTask(editingTaskId, {
        title,
        priority,
        deadline,
        assignedTo: assignedEmployee.name,
      })
    } else {
      await addTask({
        title,
        priority,
        deadline,
        assignedTo: assignedEmployee.name,
        status: 'Open',
      })
    }

    resetForm()
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false
    if (filterAssignee !== 'All' && task.assignedTo !== filterAssignee) return false
    return true
  })

  return (
    <div className="page-grid">
      <section className="card span-2">
        <div className="card-header">
          <h2>Tasks by employee</h2>
        </div>
        <div className="page-actions-buttons" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as 'All' | 'Open' | 'Submitted' | 'Approved' | 'Rejected',
              )
            }
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as 'All' | TaskPriority)}
          >
            <option value="All">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            className="filter-select"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="All">All team members</option>
            {Array.from(new Set(tasks.map((t) => t.assignedTo))).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Assigned to</th>
                <th>Status</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{task.deadline}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.status}</td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const assignee = employees.find((emp) => emp.name === task.assignedTo)
                        setTitle(task.title)
                        setPriority(task.priority)
                        setDeadline(task.deadline)
                        setEmployeeId(assignee?.id ?? '')
                        setEditingTaskId(task.id)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm(`Delete task "${task.title}"?`)
                        if (!ok) return
                        void deleteTask(task.id)
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

      <section className="card span-2">
        <div className="card-header">
          <h2>Add task to team member</h2>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Prepare sprint report"
            />
          </div>
          <div className="field-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="task-deadline">Deadline</label>
            <input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="task-employee">Assign to</label>
            <select
              id="task-employee"
              className="form-select"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="">Select team member…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            {editingTaskId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
            <button type="submit" className="primary-button sm">
              {editingTaskId ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

