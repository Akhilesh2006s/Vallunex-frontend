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

  // List filters
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

  const handleTemperatureChange = (leadId: string, temperature: LeadTemperature) => {
    void updateLead(leadId, { temperature })
  }

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    void updateLead(leadId, { status })
  }

  const pipelineLeads = leads.filter((lead) => lead.status !== 'Client')

  const filteredLeads = pipelineLeads.filter((lead) => {
    if (filterTemp !== 'All' && lead.temperature !== filterTemp) return false
    if (filterStatusValue !== 'All' && lead.status !== filterStatusValue) return false
    if (filterRep !== 'All' && lead.salesRep !== filterRep) return false
    if (filterSearch && !lead.clientName.toLowerCase().includes(filterSearch.toLowerCase())) return false
    return true
  })

  return (
    <div className="page-grid">
      <section className="card span-3">
        <div className="card-header with-actions">
          <div>
            <h2>Leads</h2>
            <p className="card-subtitle">Track cold, warm and hot leads until they are ready to become clients.</p>
          </div>
        </div>
        <div className="page-actions-buttons" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
          <input
            className="form-select"
            style={{ maxWidth: 220 }}
            placeholder="Search client…"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterTemp}
            onChange={(e) => setFilterTemp(e.target.value as 'All' | LeadTemperature)}
          >
            <option value="All">All temperatures</option>
            <option value="Cold">Cold</option>
            <option value="Warm">Warm</option>
            <option value="Hot">Hot</option>
          </select>
          <select
            className="filter-select"
            value={filterStatusValue}
            onChange={(e) => setFilterStatusValue(e.target.value as 'All' | LeadStatus)}
          >
            <option value="All">All statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Negotiation">Negotiation</option>
          </select>
          <select
            className="filter-select"
            value={filterRep}
            onChange={(e) => setFilterRep(e.target.value)}
          >
            <option value="All">All sales reps</option>
            {Array.from(new Set(leads.map((l) => l.salesRep))).map((repOption) => (
              <option key={repOption} value={repOption}>
                {repOption}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client name</th>
                <th>Temperature</th>
                <th>Status</th>
                <th>Expected value</th>
                <th>Sales rep</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.clientName}</td>
                  <td>
                    <select
                      className="filter-select"
                      value={lead.temperature}
                      onChange={(e) => handleTemperatureChange(lead.id, e.target.value as LeadTemperature)}
                    >
                      <option value="Cold">Cold</option>
                      <option value="Warm">Warm</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Negotiation">Negotiation</option>
                    </select>
                  </td>
                  <td>
                    {lead.value.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    })}{' '}
                    <span className="card-subtitle">{lead.valuePeriod === 'Monthly' ? 'per month' : 'per year'}</span>
                  </td>
                  <td>{lead.salesRep}</td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button strong"
                      onClick={() => void convertLeadToClient(lead.id)}
                    >
                      Turn to client
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm(`Delete lead "${lead.clientName}"?`)
                        if (!ok) return
                        void deleteLead(lead.id)
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card span-1">
        <div className="card-header">
          <h2>Add lead</h2>
        </div>
        <form className="modal-form" onSubmit={handleAddLead}>
          <div className="field-group">
            <label htmlFor="lead-name">Client name</label>
            <input
              id="lead-name"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Acme Industries"
            />
          </div>
          <div className="field-group">
            <label htmlFor="lead-value">Deal value (₹)</label>
            <input
              id="lead-value"
              type="number"
              min="0"
              value={leadValue}
              onChange={(e) => setLeadValue(e.target.value)}
              placeholder="2500000"
            />
          </div>
          <div className="field-group">
            <label htmlFor="lead-period">Value period</label>
            <select
              id="lead-period"
              className="form-select"
              value={leadValuePeriod}
              onChange={(e) => setLeadValuePeriod(e.target.value as LeadValuePeriod)}
            >
              <option value="Monthly">Per month</option>
              <option value="Yearly">Per year</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="lead-rep">Sales rep (optional)</label>
            <input
              id="lead-rep"
              value={leadRep}
              onChange={(e) => setLeadRep(e.target.value)}
              placeholder="Unassigned"
            />
          </div>
          <div className="field-group">
            <label htmlFor="lead-temperature">Lead temperature</label>
            <select
              id="lead-temperature"
              className="form-select"
              value={leadTemperature}
              onChange={(e) => setLeadTemperature(e.target.value as LeadTemperature)}
            >
              <option value="Cold">Cold</option>
              <option value="Warm">Warm</option>
              <option value="Hot">Hot</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="lead-status">Status</label>
            <select
              id="lead-status"
              className="form-select"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="submit" className="primary-button sm">
              Add lead
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

