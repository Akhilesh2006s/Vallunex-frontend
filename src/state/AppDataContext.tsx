import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type EmployeeStatus = 'Paid' | 'Pending'

export type Employee = {
  id: string
  name: string
  email?: string
  role: string
  salary: number
  status: EmployeeStatus
  // Optional login password for employee accounts (never shown in UI).
  password?: string
}

export type TaskPriority = 'Low' | 'Medium' | 'High'

export type TaskStatus = 'Open' | 'Submitted' | 'Approved' | 'Rejected'

export type Task = {
  id: string
  title: string
  priority: TaskPriority
  deadline: string
  assignedTo: string
  status: TaskStatus
  submissionLink?: string
}

export type LeadStatus = 'New' | 'In Review' | 'Negotiation' | 'Client'

export type Lead = {
  id: string
  clientName: string
  status: LeadStatus
  value: number
  salesRep: string
}

export type ProjectStatus = 'Planned' | 'In Progress' | 'On Hold' | 'Completed'

export type Project = {
  id: string
  name: string
  clientName: string
  status: ProjectStatus
  budget?: number
  ownerEmployeeId: string
  ownerEmployeeName: string
}

type AppDataSnapshot = {
  employees: Employee[]
  tasks: Task[]
  leads: Lead[]
  projects: Project[]
}

type AppDataContextValue = AppDataSnapshot & {
  isLoading: boolean
  addEmployee: (input: Omit<Employee, 'id'>) => void
  approveEmployee: (id: string) => void
  approveAllPayroll: () => void
  updateEmployee: (id: string, changes: Partial<Pick<Employee, 'name' | 'role' | 'salary' | 'status'>>) => void
  deleteEmployee: (id: string) => void

  addTask: (input: Omit<Task, 'id'>) => void
  submitTask: (id: string, submissionLink: string) => void
  approveTask: (id: string) => void
  rejectTask: (id: string) => void

  addLead: (input: Omit<Lead, 'id' | 'status'> & { status?: LeadStatus }) => void
  convertLeadToClient: (id: string) => void
  deleteLead: (id: string) => void

  projects: Project[]
  addProject: (input: { name: string; clientName: string; status: ProjectStatus; budget?: number; ownerEmployeeId: string }) => void
  updateProject: (id: string, changes: Partial<Pick<Project, 'name' | 'clientName' | 'status' | 'budget' | 'ownerEmployeeId'>>) => void
  deleteProject: (id: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://vallunex-company-app-backend-production.up.railway.app/api'

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined)

type AppDataProviderProps = {
  children: ReactNode
  authToken?: string
}

export function AppDataProvider({ children, authToken }: AppDataProviderProps) {
  const [state, setState] = useState<AppDataSnapshot>({
    employees: [],
    tasks: [],
    leads: [],
    projects: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [employeesRes, tasksRes, leadsRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/employees`),
          fetch(`${API_BASE_URL}/tasks`),
          fetch(`${API_BASE_URL}/leads`),
          fetch(`${API_BASE_URL}/projects`),
        ])

        const [employeesRaw, tasks, leads, projects] = await Promise.all([
          employeesRes.json(),
          tasksRes.json(),
          leadsRes.json(),
          projectsRes.json(),
        ])

        const employees: (Employee & { _id?: string })[] = employeesRaw

        setState({
          employees: employees.map((emp) => ({
            ...emp,
            id: (emp as any)._id ?? emp.id,
          })),
          tasks,
          leads,
          projects,
        })
      } catch (error) {
        console.error('Failed to load data from API', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAll()
  }, [])

  const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {}

  const addEmployee: AppDataContextValue['addEmployee'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(input),
    })
    const created: Employee & { _id?: string } = await res.json()
    setState((prev) => ({
      ...prev,
      employees: [...prev.employees, { ...created, id: (created as any)._id ?? created.id }],
    }))
  }

  const approveEmployee: AppDataContextValue['approveEmployee'] = async (id) => {
    const res = await fetch(`${API_BASE_URL}/employees/${id}/approve`, {
      method: 'PATCH',
      headers: authHeaders,
    })
    const updated: Employee & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) => (emp.id === id || emp.id === updatedId ? { ...emp, status: 'Paid' } : emp)),
    }))
  }

  const updateEmployee: AppDataContextValue['updateEmployee'] = async (id, changes) => {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(changes),
    })
    const updated: Employee & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) =>
        emp.id === id || emp.id === updatedId ? { ...emp, ...updated, id: updatedId } : emp,
      ),
    }))
  }

  const deleteEmployee: AppDataContextValue['deleteEmployee'] = async (id) => {
    await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    setState((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== id),
    }))
  }

  const approveAllPayroll: AppDataContextValue['approveAllPayroll'] = async () => {
    const res = await fetch(`${API_BASE_URL}/employees/approve-all`, {
      method: 'POST',
      headers: authHeaders,
    })
    const employees: (Employee & { _id?: string })[] = await res.json()
    setState((prev) => ({
      ...prev,
      employees: employees.map((emp) => ({ ...emp, id: (emp as any)._id ?? emp.id })),
    }))
  }

  const addTask: AppDataContextValue['addTask'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(input),
    })
    const created: Task & { _id?: string } = await res.json()
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { ...created, id: (created as any)._id ?? created.id }],
    }))
  }

  const submitTask: AppDataContextValue['submitTask'] = async (id, submissionLink) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/submit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ submissionLink }),
    })
    const updated: Task & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id || task.id === updatedId ? { ...task, ...updated, id: updatedId } : task,
      ),
    }))
  }

  const approveTask: AppDataContextValue['approveTask'] = async (id) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/approve`, {
      method: 'PATCH',
      headers: authHeaders,
    })
    const updated: Task & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id || task.id === updatedId ? { ...task, ...updated, id: updatedId } : task,
      ),
    }))
  }

  const rejectTask: AppDataContextValue['rejectTask'] = async (id) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/reject`, {
      method: 'PATCH',
      headers: authHeaders,
    })
    const updated: Task & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id || task.id === updatedId ? { ...task, ...updated, id: updatedId } : task,
      ),
    }))
  }

  const addLead: AppDataContextValue['addLead'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(input),
    })
    const created: Lead & { _id?: string } = await res.json()
    setState((prev) => ({
      ...prev,
      leads: [...prev.leads, { ...created, id: (created as any)._id ?? created.id }],
    }))
  }

  const convertLeadToClient: AppDataContextValue['convertLeadToClient'] = async (id) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/convert`, {
      method: 'PATCH',
      headers: authHeaders,
    })
    const updated: Lead & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === id || lead.id === updatedId ? { ...lead, status: 'Client' } : lead,
      ),
    }))
  }

  const deleteLead: AppDataContextValue['deleteLead'] = async (id) => {
    await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    setState((prev) => ({
      ...prev,
      leads: prev.leads.filter((lead) => lead.id !== id),
    }))
  }

  const addProject: AppDataContextValue['addProject'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(input),
    })
    const created: Project & { _id?: string } = await res.json()
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...created, id: (created as any)._id ?? created.id }],
    }))
  }

  const updateProject: AppDataContextValue['updateProject'] = async (id, changes) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(changes),
    })
    const updated: Project & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id || project.id === updatedId ? { ...project, ...updated, id: updatedId } : project,
      ),
    }))
  }

  const deleteProject: AppDataContextValue['deleteProject'] = async (id) => {
    await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }))
  }

  const value: AppDataContextValue = {
    ...state,
    isLoading,
    addEmployee,
    approveEmployee,
    approveAllPayroll,
    updateEmployee,
    deleteEmployee,
    addTask,
    submitTask,
    approveTask,
    rejectTask,
    addLead,
    convertLeadToClient,
    deleteLead,
    projects: state.projects,
    addProject,
    updateProject,
    deleteProject,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return ctx
}


