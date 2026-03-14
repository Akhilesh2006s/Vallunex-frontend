import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { CompanyPortal } from '../App'

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
  productIds?: string[]
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
  projectId?: string
}

export type LeadStatus = 'New' | 'In Review' | 'Negotiation' | 'Client'

export type LeadTemperature = 'Cold' | 'Warm' | 'Hot'

export type LeadValuePeriod = 'Monthly' | 'Yearly'

export type Lead = {
  id: string
  clientName: string
  status: LeadStatus
  temperature: LeadTemperature
  value: number
  valuePeriod: LeadValuePeriod
  salesRep: string
  productIds: string[]
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

export type Product = {
  id: string
  name: string
  techStack: string
  revenue: number
}

type AppDataSnapshot = {
  employees: Employee[]
  tasks: Task[]
  leads: Lead[]
  projects: Project[]
  products: Product[]
}

type AppDataContextValue = AppDataSnapshot & {
  isLoading: boolean
  addEmployee: (input: Omit<Employee, 'id'>) => void
  approveEmployee: (id: string) => void
  approveAllPayroll: () => void
  updateEmployee: (id: string, changes: Partial<Pick<Employee, 'name' | 'role' | 'salary' | 'status' | 'productIds'>>) => void
  deleteEmployee: (id: string) => void

  addTask: (input: Omit<Task, 'id'>) => void
  updateTask: (id: string, changes: Partial<Pick<Task, 'title' | 'priority' | 'deadline' | 'assignedTo' | 'status' | 'projectId'>>) => void
  deleteTask: (id: string) => void
  submitTask: (id: string, submissionLink: string) => void
  approveTask: (id: string) => void
  rejectTask: (id: string) => void

  addLead: (input: {
    clientName: string
    value: number
    salesRep: string
    status?: LeadStatus
    temperature?: LeadTemperature
    valuePeriod?: LeadValuePeriod
    productIds?: string[]
  }) => void
  updateLead: (
    id: string,
    changes: Partial<
      Pick<Lead, 'status' | 'temperature' | 'productIds' | 'clientName' | 'value' | 'valuePeriod' | 'salesRep'>
    >,
  ) => void
  convertLeadToClient: (id: string) => void
  deleteLead: (id: string) => void

  projects: Project[]
  addProject: (input: { name: string; clientName: string; status: ProjectStatus; budget?: number; ownerEmployeeId: string }) => void
  updateProject: (id: string, changes: Partial<Pick<Project, 'name' | 'clientName' | 'status' | 'budget' | 'ownerEmployeeId'>>) => void
  deleteProject: (id: string) => void

  products: Product[]
  addProduct: (input: Omit<Product, 'id'>) => void
  updateProduct: (id: string, changes: Partial<Pick<Product, 'name' | 'techStack' | 'revenue'>>) => void
  deleteProduct: (id: string) => void
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://vallunex-company-app-backend-production.up.railway.app/api'

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined)

type AppDataProviderProps = {
  children: ReactNode
  authToken?: string
  company: CompanyPortal
}

export function AppDataProvider({ children, authToken, company }: AppDataProviderProps) {
  const [state, setState] = useState<AppDataSnapshot>({
    employees: [],
    tasks: [],
    leads: [],
    projects: [],
    products: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!company) {
      setIsLoading(false)
      return
    }
    
    const loadAll = async () => {
      setIsLoading(true)
      // Reset state when company changes to avoid showing stale data
      setState({
        employees: [],
        tasks: [],
        leads: [],
        projects: [],
        products: [],
      })
      try {
        const companyParam = `?company=${company}`
        const [employeesRes, tasksRes, leadsRes, projectsRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/employees${companyParam}`),
          fetch(`${API_BASE_URL}/tasks${companyParam}`),
          fetch(`${API_BASE_URL}/leads${companyParam}`),
          fetch(`${API_BASE_URL}/projects${companyParam}`),
          fetch(`${API_BASE_URL}/products${companyParam}`),
        ])

        const [employeesRaw, tasks, leadsRaw, projectsRaw, productsRaw] = await Promise.all([
          employeesRes.json(),
          tasksRes.json(),
          leadsRes.json(),
          projectsRes.json(),
          productsRes.json(),
        ])

        const employees: (Employee & { _id?: string })[] = employeesRaw
        const leads: (Lead & { _id?: string })[] = leadsRaw
        const projects: (Project & { _id?: string })[] = projectsRaw
        const products: (Product & { _id?: string })[] = productsRaw

        // Client-side filtering as safety net - ensure we only show data for current company
        // This handles cases where backend might not filter properly
        // Existing data without company field will be shown only for RNXA (backward compatibility)
        const filterByCompany = <T extends Record<string, any>>(items: T[]): T[] => {
          return items.filter((item) => {
            const itemCompany = item.company?.toLowerCase()
            // If no company field exists, assume it's RNXA data (for backward compatibility)
            if (!itemCompany) {
              return company === 'rnxa'
            }
            return itemCompany === company.toLowerCase()
          })
        }

        console.log(`[AppDataContext] Loading data for company: ${company}`)

        const mappedEmployees = employees.map((emp) => ({
          ...emp,
          id: (emp as any)._id ?? emp.id,
          productIds: (emp as any).productIds ? (emp as any).productIds.map(String) : [],
        }))

        const mappedTasks = tasks.map((task: Task & { _id?: string }) => ({
          ...task,
          id: task._id ?? task.id,
        }))

        const mappedLeads = leads.map((lead) => ({
          ...lead,
          id: (lead as any)._id ?? lead.id,
          temperature: (lead as any).temperature ?? 'Cold',
          valuePeriod: (lead as any).valuePeriod ?? 'Monthly',
          productIds: (lead as any).productIds ? (lead as any).productIds.map(String) : [],
        }))

        const mappedProjects = projects.map((project) => ({
          ...project,
          id: (project as any)._id ?? project.id,
        }))

        const mappedProducts = products.map((product) => ({
          ...product,
          id: (product as any)._id ?? product.id,
        }))

        setState({
          employees: filterByCompany(mappedEmployees),
          tasks: filterByCompany(mappedTasks),
          leads: filterByCompany(mappedLeads),
          projects: filterByCompany(mappedProjects),
          products: filterByCompany(mappedProducts),
        })
      } catch (error) {
        console.error('Failed to load data from API', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAll()
  }, [company])

  const getAuthHeaders = (): HeadersInit => {
    return authToken ? { Authorization: `Bearer ${authToken}` } : {}
  }

  const addEmployee: AppDataContextValue['addEmployee'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ...input, company }),
    })
    const created: Employee & { _id?: string } = await res.json()
    const createdId = (created as any)._id ?? created.id
    // Ensure the created item has company field for client-side filtering
    const createdWithCompany = { ...created, id: createdId, company: (created as any).company || company }
    setState((prev) => ({
      ...prev,
      employees: [...prev.employees, createdWithCompany],
    }))
  }

  const approveEmployee: AppDataContextValue['approveEmployee'] = async (id) => {
    const res = await fetch(`${API_BASE_URL}/employees/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
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
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
      headers: getAuthHeaders(),
    })
    setState((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== id),
    }))
  }

  const approveAllPayroll: AppDataContextValue['approveAllPayroll'] = async () => {
    const res = await fetch(`${API_BASE_URL}/employees/approve-all?company=${company}`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ...input, company }),
    })
    const created: Task & { _id?: string } = await res.json()
    const createdId = (created as any)._id ?? created.id
    // Ensure the created item has company field for client-side filtering
    const createdWithCompany = { ...created, id: createdId, company: (created as any).company || company }
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, createdWithCompany],
    }))
  }

  const updateTask: AppDataContextValue['updateTask'] = async (id, changes) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(changes),
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

  const deleteTask: AppDataContextValue['deleteTask'] = async (id) => {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }))
  }

  const submitTask: AppDataContextValue['submitTask'] = async (id, submissionLink) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/submit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ...input, company }),
    })
    const created: Lead & { _id?: string } = await res.json()
    const createdId = (created as any)._id ?? created.id
    setState((prev) => ({
      ...prev,
      leads: [
        ...prev.leads,
        {
          ...created,
          id: createdId,
          company: (created as any).company || company,
          temperature: (created as any).temperature ?? 'Cold',
          valuePeriod: (created as any).valuePeriod ?? input.valuePeriod ?? 'Monthly',
          productIds: (created as any).productIds ? (created as any).productIds.map(String) : [],
        },
      ],
    }))
  }

  const updateLead: AppDataContextValue['updateLead'] = async (id, changes) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(changes),
    })
    const updated: Lead & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === id || lead.id === updatedId
          ? {
              ...lead,
              ...updated,
              id: updatedId,
              temperature: (updated as any).temperature ?? lead.temperature ?? 'Cold',
              valuePeriod: (updated as any).valuePeriod ?? lead.valuePeriod ?? 'Monthly',
              productIds: (updated as any).productIds
                ? (updated as any).productIds.map(String)
                : lead.productIds ?? [],
            }
          : lead,
      ),
    }))
  }

  const convertLeadToClient: AppDataContextValue['convertLeadToClient'] = async (id) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/convert`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    })
    setState((prev) => ({
      ...prev,
      leads: prev.leads.filter((lead) => lead.id !== id),
    }))
  }

  const addProject: AppDataContextValue['addProject'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ...input, company }),
    })
    const created: Project & { _id?: string } = await res.json()
    const createdId = (created as any)._id ?? created.id
    // Ensure the created item has company field for client-side filtering
    const createdWithCompany = { ...created, id: createdId, company: (created as any).company || company }
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, createdWithCompany],
    }))
  }

  const updateProject: AppDataContextValue['updateProject'] = async (id, changes) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
      headers: getAuthHeaders(),
    })
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }))
  }

  const addProduct: AppDataContextValue['addProduct'] = async (input) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ...input, company }),
    })
    const created: Product & { _id?: string } = await res.json()
    const createdId = (created as any)._id ?? created.id
    // Ensure the created item has company field for client-side filtering
    const createdWithCompany = { ...created, id: createdId, company: (created as any).company || company }
    setState((prev) => ({
      ...prev,
      products: [...prev.products, createdWithCompany],
    }))
  }

  const updateProduct: AppDataContextValue['updateProduct'] = async (id, changes) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(changes),
    })
    const updated: Product & { _id?: string } = await res.json()
    const updatedId = (updated as any)._id ?? updated.id
    setState((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id || product.id === updatedId ? { ...product, ...updated, id: updatedId } : product,
      ),
    }))
  }

  const deleteProduct: AppDataContextValue['deleteProduct'] = async (id) => {
    await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
      // Also remove the product from any associated leads.
      leads: prev.leads.map((lead) => ({
        ...lead,
        productIds: lead.productIds.filter((pid) => pid !== id),
      })),
      // And remove from any team members it's assigned to.
      employees: prev.employees.map((emp) => ({
        ...emp,
        productIds: emp.productIds?.filter((pid) => pid !== id),
      })),
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
    updateTask,
    deleteTask,
    submitTask,
    approveTask,
    rejectTask,
    addLead,
    updateLead,
    convertLeadToClient,
    deleteLead,
    projects: state.projects,
    addProject,
    updateProject,
    deleteProject,
    products: state.products,
    addProduct,
    updateProduct,
    deleteProduct,
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


