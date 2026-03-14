import { useState, type FormEvent } from 'react'
import {
  useAppData,
  type LeadTemperature,
  type LeadStatus,
  type LeadValuePeriod,
} from '../state/AppDataContext'

export function SalesDashboard() {
  const { leads, addLead, updateLead, convertLeadToClient, deleteLead } = useAppData()

  const [leadName, setLeadName] = useState('')
  const [leadValue, setLeadValue] = useState('')
  const [leadRep, setLeadRep] = useState('')
  const [leadTemperature, setLeadTemperature] = useState<LeadTemperature>('Cold')
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New')
  const [leadValuePeriod, setLeadValuePeriod] = useState<LeadValuePeriod>('Monthly')

  const handleAddLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!leadName || !leadValue) return
    const numericValue = Number(leadValue)
    if (Number.isNaN(numericValue)) return

    await addLead({
      clientName: leadName,
      value: numericValue,
      salesRep: leadRep || 'Unassigned',
      status: leadStatus,
      temperature: leadTemperature,
      valuePeriod: leadValuePeriod,
    })

    setLeadName('')
    setLeadValue('')
    setLeadRep('')
    setLeadTemperature('Cold')
    setLeadStatus('New')
    setLeadValuePeriod('Monthly')
  }

  const pipelineLeads = leads.filter((lead) => lead.status !== 'Client')
  const clients = leads.filter((lead) => lead.status === 'Client')
  const totalPipelineValue = pipelineLeads.reduce((s, l) => s + l.value, 0)
  const hotLeads = pipelineLeads.filter((l) => l.temperature === 'Hot').length
  const warmLeads = pipelineLeads.filter((l) => l.temperature === 'Warm').length
  const coldLeads = pipelineLeads.filter((l) => l.temperature === 'Cold').length

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header">
          <h2>Sales Dashboard</h2>
          <p className="card-subtitle">Manage your pipeline, track leads and close deals.</p>
        </div>
        <div className="overview-grid">
          <div className="stat-card">
            <div className="stat-label">Pipeline</div>
            <div className="stat-value">{pipelineLeads.length}</div>
            <div className="stat-meta">Active leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pipeline Value</div>
            <div className="stat-value">
              {totalPipelineValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta">Total expected</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">🔥 Hot</div>
            <div className="stat-value">{hotLeads}</div>
            <div className="stat-meta positive">Ready to convert</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Clients</div>
            <div className="stat-value">{clients.length}</div>
            <div className="stat-meta positive">Converted</div>
          </div>
        </div>
      </section>

      {/* Lead List */}
      <section className="card span-3">
        <div className="card-header with-actions">
          <h2>Pipeline Leads</h2>
          <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
            <span>❄️ Cold: {coldLeads}</span>
            <span>🌤 Warm: {warmLeads}</span>
            <span>🔥 Hot: {hotLeads}</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Temperature</th>
                <th>Status</th>
                <th>Value</th>
                <th>Rep</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pipelineLeads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 600 }}>{lead.clientName}</td>
                  <td>
                    <select
                      className="filter-select"
                      value={lead.temperature}
                      onChange={(e) => void updateLead(lead.id, { temperature: e.target.value as LeadTemperature })}
                    >
                      <option value="Cold">❄️ Cold</option>
                      <option value="Warm">🌤 Warm</option>
                      <option value="Hot">🔥 Hot</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      value={lead.status}
                      onChange={(e) => void updateLead(lead.id, { status: e.target.value as LeadStatus })}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Negotiation">Negotiation</option>
                    </select>
                  </td>
                  <td>
                    {lead.value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </td>
                  <td>{lead.salesRep}</td>
                  <td className="table-actions-col">
                    <button type="button" className="link-button strong" onClick={() => void convertLeadToClient(lead.id)}>
                      Convert
                    </button>
                    <button
                      type="button"
                      className="link-button danger"
                      onClick={() => { if (window.confirm(`Delete "${lead.clientName}"?`)) void deleteLead(lead.id) }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {pipelineLeads.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-title">No leads in pipeline</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Lead Form */}
      <section className="card span-1">
        <div className="card-header"><h2>New Lead</h2></div>
        <form className="modal-form" onSubmit={handleAddLead}>
          <div className="field-group">
            <label htmlFor="lead-name">Client Name</label>
            <input id="lead-name" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Tech Corp" />
          </div>
          <div className="field-group">
            <label htmlFor="lead-value">Deal Value (₹)</label>
            <input id="lead-value" type="number" min="0" value={leadValue} onChange={(e) => setLeadValue(e.target.value)} placeholder="500000" />
          </div>
          <div className="field-group">
            <label htmlFor="lead-period">Period</label>
            <select id="lead-period" value={leadValuePeriod} onChange={(e) => setLeadValuePeriod(e.target.value as LeadValuePeriod)}>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="lead-rep">Sales Rep</label>
            <input id="lead-rep" value={leadRep} onChange={(e) => setLeadRep(e.target.value)} placeholder="Unassigned" />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="lead-temp">Temperature</label>
              <select id="lead-temp" value={leadTemperature} onChange={(e) => setLeadTemperature(e.target.value as LeadTemperature)}>
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="lead-status">Status</label>
              <select id="lead-status" value={leadStatus} onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}>
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Negotiation">Negotiation</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="primary-button sm">Add Lead</button>
          </div>
        </form>
      </section>
    </div>
  )
}
