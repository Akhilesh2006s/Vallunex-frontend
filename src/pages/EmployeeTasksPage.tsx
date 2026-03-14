import { useState, type FormEvent } from 'react'
import { useAppData, type TaskPriority } from '../state/AppDataContext'

export function EmployeeTasksPage() {
  const { employees, tasks, projects, addTask, updateTask, deleteTask } = useAppData()

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [deadline, setDeadline] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Submitted' | 'Approved' | 'Rejected'>('All')
  const [filterPriority, setFilterPriority] = useState<'All' | TaskPriority>('All')
  const [filterAssignee, setFilterAssignee] = useState<string>('All')

  const resetForm = () => {
    setTitle('')
    setPriority('Medium')
    setDeadline('')
    setEmployeeId('')
    setProjectId('')
    setEditingTaskId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title || !deadline || !employeeId) return
    const assignedEmployee = employees.find((emp) => emp.id === employeeId)
    if (!assignedEmployee) return

    if (editingTaskId) {
      await updateTask(editingTaskId, { title, priority, deadline, assignedTo: assignedEmployee.name })
    } else {
      await addTask({
        title,
        priority,
        deadline,
        assignedTo: assignedEmployee.name,
        status: 'Open',
        projectId: projectId || undefined,
      })
    }
    resetForm()
  }

  // Filter out tasks without IDs and apply filters
  const filteredTasks = tasks.filter((task) => {
    if (!task.id) return false // Skip tasks without IDs
    if (filterStatus !== 'All' && task.status !== filterStatus) return false
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false
    if (filterAssignee !== 'All' && task.assignedTo !== filterAssignee) return false
    return true
  })

  // Only count tasks with valid IDs
  const validTasks = tasks.filter((t) => t.id)
  const openCount = validTasks.filter((t) => t.status === 'Open').length
  const submittedCount = validTasks.filter((t) => t.status === 'Submitted').length
  const approvedCount = validTasks.filter((t) => t.status === 'Approved').length

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header">
          <h2>Task Management</h2>
          <p className="card-subtitle">Create, assign and track tasks across your team.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Open</div>
            <div className="stat-value">{openCount}</div>
            <div className="stat-meta">In progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Submitted</div>
            <div className="stat-value">{submittedCount}</div>
            <div className="stat-meta">Waiting review</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{approvedCount}</div>
            <div className="stat-meta positive">Completed</div>
          </div>
        </div>
      </section>

      {/* Task List */}
      <section className="card span-2">
        <div className="card-header">
          <h2>All Tasks</h2>
        </div>
        <div className="page-actions-buttons" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)}>
            <option value="All">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select className="filter-select" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
            <option value="All">All members</option>
            {Array.from(new Set(validTasks.map((t) => t.assignedTo))).map((name) => (
              <option key={name} value={name}>{name}</option>
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
                <th>Assigned To</th>
                <th>Status</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={task.id || `task-${index}`}>
                  <td style={{ fontWeight: 500 }}>{task.title}</td>
                  <td>
                    <span className={`pill ${task.priority === 'High' ? 'pill-danger' : task.priority === 'Medium' ? 'pill-warning' : ''}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.deadline}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    <span className={`pill ${task.status === 'Approved' ? 'pill-success' : task.status === 'Submitted' ? 'pill-info' : task.status === 'Rejected' ? 'pill-danger' : ''}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        if (!task.id) return
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
                      className="link-button danger"
                      onClick={() => {
                        if (!task.id) return
                        if (window.confirm(`Delete "${task.title}"?`)) void deleteTask(task.id)
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr key="empty-tasks"><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No tasks match filters</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Task Form */}
      <section className="card span-2">
        <div className="card-header"><h2>{editingTaskId ? 'Edit Task' : 'Assign New Task'}</h2></div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="task-title">Task Title</label>
            <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Prepare sprint report" />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="task-deadline">Deadline</label>
              <input id="task-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="task-employee">Assign To</label>
            <select id="task-employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">Select team member...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="task-project">Related Project (optional)</label>
            <select id="task-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            {editingTaskId && <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>}
            <button type="submit" className="primary-button sm">{editingTaskId ? 'Save Changes' : 'Assign Task'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
