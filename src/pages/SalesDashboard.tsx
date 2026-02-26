import type { ModalType } from '../components/modals/Modal'
import { useAppData } from '../state/AppDataContext'

type SalesDashboardProps = {
  onOpenModal: (type: ModalType) => void
}

export function SalesDashboard({ onOpenModal }: SalesDashboardProps) {
  const { leads, convertLeadToClient } = useAppData()

  const totalRevenue = leads
    .filter((lead) => lead.status === 'Client')
    .reduce((sum, lead) => sum + lead.value, 0)
  const dealsClosed = leads.filter((lead) => lead.status === 'Client').length

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>Sales Overview</h2>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Revenue this month (INR)</div>
            <div className="stat-value">
              {totalRevenue.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="stat-meta positive">From converted clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Targets</div>
            <div className="stat-value">92%</div>
            <div className="stat-meta">of monthly quota</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Clients</div>
            <div className="stat-value">{dealsClosed}</div>
            <div className="stat-meta">Leads converted to clients</div>
          </div>
        </div>
      </section>

      <section className="card span-3">
        <div className="card-header with-actions">
          <div>
            <h2>Leads</h2>
            <p className="card-subtitle">Convert leads to clients with a single click.</p>
          </div>
          <button type="button" className="primary-button sm" onClick={() => onOpenModal('addLead')}>
            + Add Lead
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Status</th>
                <th>Value</th>
                <th>Assigned Rep</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.clientName}</td>
                  <td>
                    <span
                      className={`pill ${
                        lead.status === 'Client'
                          ? 'pill-success'
                          : lead.status === 'In Review' || lead.status === 'Negotiation'
                            ? 'pill-warning'
                            : ''
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    {lead.value.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>{lead.salesRep}</td>
                  <td className="table-actions-col">
                    {lead.status !== 'Client' && (
                      <button
                        type="button"
                        className="link-button strong"
                        onClick={() => convertLeadToClient(lead.id)}
                      >
                        Convert to Client
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-3">
        <div className="card-header with-actions">
          <div>
            <h2>Action Items</h2>
          </div>
          <select className="filter-select" defaultValue="all">
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="won">Won</option>
          </select>
        </div>
        <ul className="list">
          <li>
            <div className="list-title">Follow up with Acme Industries</div>
            <div className="list-meta">Due today • Owner: Jordan Lee</div>
          </li>
          <li>
            <div className="list-title">Prepare proposal for Greenfield Retail</div>
            <div className="list-meta">Tomorrow • Owner: Alex Kim</div>
          </li>
          <li>
            <div className="list-title">Q2 pipeline review</div>
            <div className="list-meta">Friday • Owner: Sales Leadership</div>
          </li>
        </ul>
      </section>

      <section className="card span-2">
        <div className="card-header">
          <h2>Meeting Schedule</h2>
        </div>
        <ul className="list">
          <li>
            <div className="list-title">Discovery call – Nova Health</div>
            <div className="list-meta">Today • 2:00 PM</div>
          </li>
          <li>
            <div className="list-title">Demo – Brightline Logistics</div>
            <div className="list-meta">Tomorrow • 11:30 AM</div>
          </li>
          <li>
            <div className="list-title">Quarterly forecast review</div>
            <div className="list-meta">Friday • 4:00 PM</div>
          </li>
        </ul>
      </section>

      <section className="card span-4">
        <div className="card-header">
          <h2>Performance</h2>
          <p className="card-subtitle">Chart placeholder – integrate analytics of your choice.</p>
        </div>
        <div className="chart-placeholder">
          <div className="chart-bars">
            <div className="chart-bar" />
            <div className="chart-bar" />
            <div className="chart-bar" />
            <div className="chart-bar" />
            <div className="chart-bar" />
          </div>
          <div className="chart-footer">Monthly revenue trend (sample only)</div>
        </div>
      </section>
    </div>
  )
}


