import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Lead, Task } from '../../state/AppDataContext'

type AdminOverviewChartsProps = {
  tasks: Task[]
  leads: Lead[]
}

export function AdminOverviewCharts({ tasks, leads }: AdminOverviewChartsProps) {
  const taskStatusData = [
    { name: 'Open', value: tasks.filter((t) => t.status === 'Open').length },
    { name: 'Submitted', value: tasks.filter((t) => t.status === 'Submitted').length },
    { name: 'Approved', value: tasks.filter((t) => t.status === 'Approved').length },
  ]

  const leadStatusData = [
    { name: 'New', value: leads.filter((l) => l.status === 'New').length },
    { name: 'In Review', value: leads.filter((l) => l.status === 'In Review').length },
    { name: 'Negotiation', value: leads.filter((l) => l.status === 'Negotiation').length },
    { name: 'Client', value: leads.filter((l) => l.status === 'Client').length },
  ]

  return (
    <div className="admin-charts-grid">
      <div className="admin-chart-card">
        <h3 className="admin-chart-title">Tasks by status</h3>
        <p className="admin-chart-subtitle">Live breakdown of work across the workflow.</p>
        <div className="admin-chart-body">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskStatusData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-chart-card">
        <h3 className="admin-chart-title">Leads & clients</h3>
        <p className="admin-chart-subtitle">Pipeline health across the sales funnel.</p>
        <div className="admin-chart-body">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={leadStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

