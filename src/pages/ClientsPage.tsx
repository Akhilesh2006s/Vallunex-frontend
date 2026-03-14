import { useState, type FormEvent } from 'react'
import { useAppData } from '../state/AppDataContext'

export function ClientsPage() {
  const { leads, products, addLead, deleteLead, updateLead } = useAppData()
  const clients = leads.filter((lead) => lead.status === 'Client')

  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [rep, setRep] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !value) return
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return
    await addLead({ clientName: name, value: numericValue, salesRep: rep || 'Unassigned', status: 'Client' })
    setName('')
    setValue('')
    setRep('')
  }

  const totalClientValue = clients.reduce((s, c) => s + c.value, 0)

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header">
          <h2>Client Management</h2>
          <p className="card-subtitle">Active clients converted from your sales pipeline.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Active Clients</div>
            <div className="stat-value">{clients.length}</div>
            <div className="stat-meta">Converted from leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Client Revenue</div>
            <div className="stat-value">
              {totalClientValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta positive">Total value</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Conversion Rate</div>
            <div className="stat-value">
              {leads.length ? `${Math.round((clients.length / leads.length) * 100)}%` : '—'}
            </div>
            <div className="stat-meta">Clients / all leads</div>
          </div>
        </div>
      </section>

      {/* Client List */}
      <section className="card span-3">
        <div className="card-header"><h2>Client List</h2></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Products</th>
                <th>Value</th>
                <th>Sales Rep</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td style={{ fontWeight: 600 }}>{client.clientName}</td>
                  <td>
                    <select
                      className="filter-select"
                      value=""
                      onChange={(e) => {
                        const val = e.target.value
                        if (!val) return
                        const newIds = client.productIds.includes(val) ? client.productIds : [...client.productIds, val]
                        void updateLead(client.id, { productIds: newIds })
                      }}
                    >
                      <option value="">Assign product...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                    {client.productIds.length > 0 && (
                      <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {client.productIds.map((id) => {
                          const prod = products.find((p) => p.id === id)
                          if (!prod) return null
                          return (
                            <span key={id} className="pill" style={{ gap: 4 }}>
                              {prod.name}
                              <button
                                type="button"
                                className="link-button danger"
                                style={{ padding: '0 2px', fontSize: 14, lineHeight: 1 }}
                                onClick={() => {
                                  const newIds = client.productIds.filter((pid) => pid !== id)
                                  void updateLead(client.id, { productIds: newIds })
                                }}
                              >
                                ×
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </td>
                  <td>
                    {client.value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    {' '}<span className="list-meta">{client.valuePeriod === 'Monthly' ? '/mo' : '/yr'}</span>
                  </td>
                  <td>{client.salesRep}</td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button danger"
                      onClick={() => { if (window.confirm(`Remove "${client.clientName}"?`)) void deleteLead(client.id) }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">🤝</div><div className="empty-state-title">No clients yet</div><div className="empty-state-text">Convert leads or add clients directly.</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Client Form */}
      <section className="card span-1">
        <div className="card-header"><h2>Add Client</h2></div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="client-name">Client Name</label>
            <input id="client-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Industries" />
          </div>
          <div className="field-group">
            <label htmlFor="client-value">Contract Value (₹)</label>
            <input id="client-value" type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="2500000" />
          </div>
          <div className="field-group">
            <label htmlFor="client-rep">Sales Rep</label>
            <input id="client-rep" value={rep} onChange={(e) => setRep(e.target.value)} placeholder="Unassigned" />
          </div>
          <div className="modal-footer">
            <button type="submit" className="primary-button sm">Add Client</button>
          </div>
        </form>
      </section>
    </div>
  )
}
