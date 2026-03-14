import { useState, type FormEvent } from 'react'
import {
  useAppData,
  type LeadTemperature,
  type LeadStatus,
  type LeadValuePeriod,
} from '../state/AppDataContext'

export function LeadsPage() {
  const { leads, addLead, updateLead, convertLeadToClient, deleteLead } = useAppData()

  const [leadName, setLeadName] = useState('')
  const [leadValue, setLeadValue] = useState('')
  const [leadRep, setLeadRep] = useState('')
  const [leadTemperature, setLeadTemperature] = useState<LeadTemperature>('Cold')
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New')
  const [leadValuePeriod, setLeadValuePeriod] = useState<LeadValuePeriod>('Monthly')

  const [filterTemp, setFilterTemp] = useState<'All' | LeadTemperature>('All')
  const [filterStatusValue, setFilterStatusValue] = useState<'All' | LeadStatus>('All')
  const [filterRep, setFilterRep] = useState<string>('All')
  const [filterSearch, setFilterSearch] = useState('')

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

  const filteredLeads = pipelineLeads.filter((lead) => {
    if (filterTemp !== 'All' && lead.temperature !== filterTemp) return false
    if (filterStatusValue !== 'All' && lead.status !== filterStatusValue) return false
    if (filterRep !== 'All' && lead.salesRep !== filterRep) return false
    if (filterSearch && !lead.clientName.toLowerCase().includes(filterSearch.toLowerCase())) return false
    return true
  })

  const totalPipelineValue = pipelineLeads.reduce((s, l) => s + l.value, 0)
  const hotLeads = pipelineLeads.filter((l) => l.temperature === 'Hot').length

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header">
          <h2>Lead Pipeline</h2>
          <p className="card-subtitle">Track cold, warm and hot leads through your sales funnel.</p>
        </div>
        <div className="overview-grid">
          <div className="stat-card">
            <div className="stat-label">Pipeline Leads</div>
            <div className="stat-value">{pipelineLeads.length}</div>
            <div className="stat-meta">Excluding converted clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pipeline Value</div>
            <div className="stat-value">
              {totalPipelineValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta">Total expected</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Hot Leads</div>
            <div className="stat-value">{hotLeads}</div>
            <div className="stat-meta positive">Ready to convert</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Converted</div>
            <div className="stat-value">{leads.filter((l) => l.status === 'Client').length}</div>
            <div className="stat-meta positive">Now clients</div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="card span-3">
        <div className="card-header">
          <h2>Lead List</h2>
        </div>
        <div className="page-actions-buttons" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <input
            className="form-select"
            style={{ maxWidth: 200, padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
            placeholder="Search..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
          <select className="filter-select" value={filterTemp} onChange={(e) => setFilterTemp(e.target.value as 'All' | LeadTemperature)}>
            <option value="All">All temperatures</option>
            <option value="Cold">Cold</option>
            <option value="Warm">Warm</option>
            <option value="Hot">Hot</option>
          </select>
          <select className="filter-select" value={filterStatusValue} onChange={(e) => setFilterStatusValue(e.target.value as 'All' | LeadStatus)}>
            <option value="All">All statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Negotiation">Negotiation</option>
          </select>
          <select className="filter-select" value={filterRep} onChange={(e) => setFilterRep(e.target.value)}>
            <option value="All">All reps</option>
            {Array.from(new Set(leads.map((l) => l.salesRep))).map((rep) => (
              <option key={rep} value={rep}>{rep}</option>
            ))}
          </select>
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
              {filteredLeads.map((lead) => (
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
                    {' '}<span className="list-meta">{lead.valuePeriod === 'Monthly' ? '/mo' : '/yr'}</span>
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
              {filteredLeads.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-title">No leads match filters</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Lead Form */}
      <section className="card span-1">
        <div className="card-header"><h2>Add Lead</h2></div>
        <form className="modal-form" onSubmit={handleAddLead}>
          <div className="field-group">
            <label htmlFor="lead-name">Client Name</label>
            <input id="lead-name" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Acme Industries" />
          </div>
          <div className="field-group">
            <label htmlFor="lead-value">Deal Value (₹)</label>
            <input id="lead-value" type="number" min="0" value={leadValue} onChange={(e) => setLeadValue(e.target.value)} placeholder="2500000" />
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
