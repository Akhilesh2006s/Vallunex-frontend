import { useAppData } from '../state/AppDataContext'

type DevPayrollPageProps = {
  currentUserName?: string
  currentUserEmail?: string
}

export function DevPayrollPage({ currentUserName, currentUserEmail }: DevPayrollPageProps) {
  const { employees } = useAppData()

  const me =
    employees.find(
      (e) => currentUserEmail && e.email && e.email.toLowerCase() === currentUserEmail.toLowerCase(),
    ) ?? employees.find((e) => currentUserName && e.name === currentUserName) ?? null

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>My payroll</h2>
          <p className="card-subtitle">Read-only view of your current salary and payroll status.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Current salary</div>
            <div className="stat-value">
              {me
                ? me.salary.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  })
                : '—'}
            </div>
            <div className="stat-meta">
              {me ? `Payroll status: ${me.status}` : 'Ask Admin to link your employee record to your login email.'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Last cycle</div>
            <div className="stat-value">{me ? 'Processed' : '—'}</div>
            <div className="stat-meta">High-level demo – detailed history can be added from backend later.</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Next review</div>
            <div className="stat-value">—</div>
            <div className="stat-meta">Placeholder for appraisal / increment dates.</div>
          </div>
        </div>
      </section>
    </div>
  )
}

