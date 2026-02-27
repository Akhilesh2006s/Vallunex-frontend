import { useState } from 'react'
import { useAppData, type TaskPriority } from '../../state/AppDataContext'

export type ModalType = 'addEmployee' | 'addTask' | 'approvePayroll' | 'addLead' | 'addProject'

type ModalProps = {
  type: ModalType
  onClose: () => void
}

export function Modal({ type, onClose }: ModalProps) {
  const { employees, addEmployee, approveAllPayroll, addTask, addLead, addProject } = useAppData()

  const [employeeName, setEmployeeName] = useState('')
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [employeeRole, setEmployeeRole] = useState<'Employee' | 'Sales' | 'Manager'>('Employee')
  const [employeePassword, setEmployeePassword] = useState('')

  const [taskTitle, setTaskTitle] = useState('')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')

  const [leadClientName, setLeadClientName] = useState('')
  const [leadValue, setLeadValue] = useState('')
  const [leadRep, setLeadRep] = useState('')

  const [projectName, setProjectName] = useState('')
  const [projectOwner, setProjectOwner] = useState('')
  const [projectDueDate, setProjectDueDate] = useState('')

  const TITLE_MAP: Record<ModalType, string> = {
    addEmployee: 'Add member',
    addTask: 'Add Task',
    approvePayroll: 'Approve Payroll',
    addLead: 'Add Sales Lead',
    addProject: 'Add Project',
  }

  const handlePrimaryAction = () => {
    if (type === 'addEmployee') {
      if (!employeeName || !employeeEmail || !employeeRole || !employeePassword) {
        onClose()
        return
      }
      addEmployee({
        name: employeeName,
        email: employeeEmail,
        role: employeeRole,
        // Salary and payroll are managed on the dedicated Payroll page.
        salary: 0,
        status: 'Pending',
        password: employeePassword,
      })
      onClose()
      return
    }

    if (type === 'addTask') {
      if (!taskTitle || !taskAssignee) {
        onClose()
        return
      }
      addTask({
        title: taskTitle,
        priority: taskPriority,
        deadline: taskDeadline || new Date().toISOString().slice(0, 10),
        // Only allow assigning to employees that Admin has added.
        assignedTo: taskAssignee,
        status: 'Open',
      })
      onClose()
      return
    }

    if (type === 'approvePayroll') {
      approveAllPayroll()
      onClose()
      return
    }

    if (type === 'addLead') {
      const valueNumber = Number(leadValue.replace(/[^0-9.-]+/g, ''))
      if (!leadClientName || Number.isNaN(valueNumber)) {
        onClose()
        return
      }
      addLead({
        clientName: leadClientName,
        value: valueNumber,
        salesRep: leadRep || 'Unassigned',
      })
      onClose()
      return
    }

    if (type === 'addProject') {
      if (!projectName) {
        onClose()
        return
      }
      // Find employee by name or use first available employee
      const selectedEmployee = employees.find((emp) => emp.name === projectOwner) || employees[0]
      addProject({
        name: projectName,
        clientName: projectOwner || 'Unassigned',
        status: 'Planned',
        ownerEmployeeId: selectedEmployee?.id || '',
      })
      onClose()
      return
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{TITLE_MAP[type]}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {type === 'addEmployee' && (
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-group">
                <label htmlFor="employeeName">Full name</label>
                <input
                  id="employeeName"
                  placeholder="Jane Doe"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label htmlFor="employeeEmail">Work email</label>
                <input
                  id="employeeEmail"
                  type="email"
                  placeholder="jane@company.com"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label htmlFor="employeeRole">Role</label>
                  <select
                  id="employeeRole"
                  value={employeeRole}
                  onChange={(e) =>
                    setEmployeeRole(e.target.value as 'Employee' | 'Sales' | 'Manager')
                  }
                  >
                  <option value="Employee">Member</option>
                  <option value="Sales">Sales</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="employeePassword">Login password</label>
                <input
                  id="employeePassword"
                  type="password"
                  placeholder="Set a temporary password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                />
                <p className="field-helper-text">
                  Team members (like Akhilesh or Madhav) will use this email and password to log in.
                </p>
              </div>
            </form>
          )}

          {type === 'addTask' && (
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-group">
                <label htmlFor="taskTitle">Task title</label>
                <input
                  id="taskTitle"
                  placeholder="Prepare client presentation"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="taskPriority">Priority</label>
                  <select
                    id="taskPriority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="taskDueDate">Due date</label>
                  <input
                    id="taskDueDate"
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                  />
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="taskAssignee">Assign to member</label>
                <select
                  id="taskAssignee"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                >
                  <option value="">Select member</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          )}

          {type === 'approvePayroll' && (
            <div className="modal-form">
              <p className="modal-text">
                Approve the current payroll batch. All employees with a Pending status will be marked as Paid. This
                action only updates data within this demo app.
              </p>
            </div>
          )}

          {type === 'addLead' && (
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-group">
                <label htmlFor="leadClientName">Client name</label>
                <input
                  id="leadClientName"
                  placeholder="Acme Industries"
                  value={leadClientName}
                  onChange={(e) => setLeadClientName(e.target.value)}
                />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="leadValue">Estimated value</label>
                  <input
                    id="leadValue"
                    placeholder="$45,000"
                    value={leadValue}
                    onChange={(e) => setLeadValue(e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="leadRep">Sales rep</label>
                  <input
                    id="leadRep"
                    placeholder="Jordan Lee"
                    value={leadRep}
                    onChange={(e) => setLeadRep(e.target.value)}
                  />
                </div>
              </div>
            </form>
          )}

          {type === 'addProject' && (
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-group">
                <label htmlFor="projectName">Project name</label>
                <input
                  id="projectName"
                  placeholder="New mobile dashboard"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label htmlFor="projectOwner">Owner</label>
                <input
                  id="projectOwner"
                  placeholder="Squad Alpha"
                  value={projectOwner}
                  onChange={(e) => setProjectOwner(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label htmlFor="projectDueDate">Target completion</label>
                <input
                  id="projectDueDate"
                  type="date"
                  value={projectDueDate}
                  onChange={(e) => setProjectDueDate(e.target.value)}
                />
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-button" onClick={handlePrimaryAction}>
            {type === 'approvePayroll' ? 'Approve' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}


