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

    await addLead({
      clientName: name,
      value: numericValue,
      salesRep: rep || 'Unassigned',
      status: 'Client',
    })

    setName('')
    setValue('')
    setRep('')
  }

  return (
    <div className="page-grid">
      <section className="card span-4">
        <div className="card-header">
          <h2>Clients</h2>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Active clients</div>
            <div className="stat-value">{clients.length}</div>
            <div className="stat-meta">Converted from Sales pipeline</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pipeline size</div>
            <div className="stat-value">{leads.length}</div>
            <div className="stat-meta">All leads &amp; clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Conversion rate</div>
            <div className="stat-value">
              {leads.length ? `${Math.round((clients.length / leads.length) * 100)}%` : '—'}
            </div>
            <div className="stat-meta">Clients / total leads</div>
          </div>
        </div>
      </section>

      <section className="card span-3">
        <div className="card-header">
          <h2>Client list</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client name</th>
                <th>Status</th>
                <th>Products</th>
                <th>Value</th>
                <th>Sales rep</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.clientName}</td>
                  <td>
                    <span className="pill pill-success">Client</span>
                  </td>
                  <td>
                    {client.productIds.length ? (
                      <select
                        className="filter-select"
                        multiple={false}
                        onChange={(e) => {
                          const value = e.target.value
                          if (!value) return
                          const newProductIds = client.productIds.includes(value)
                            ? client.productIds
                            : [...client.productIds, value]
                          void updateLead(client.id, { productIds: newProductIds })
                        }}
                        value=""
                      >
                        <option value="">Assign product…</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="filter-select"
                        onChange={(e) => {
                          const value = e.target.value
                          if (!value) return
                          void updateLead(client.id, { productIds: [value] })
                        }}
                        value=""
                      >
                        <option value="">Assign product…</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {client.productIds.length > 0 && (
                      <div className="card-subtitle">
                        {client.productIds
                          .map((id) => products.find((p) => p.id === id)?.name)
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}
                  </td>
                  <td>
                    {client.value.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    })}{' '}
                    <span className="card-subtitle">
                      {client.valuePeriod === 'Monthly' ? 'per month' : 'per year'}
                    </span>
                  </td>
                  <td>{client.salesRep}</td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm(`Remove client "${client.clientName}"?`)
                        if (!ok) return
                        void deleteLead(client.id)
                      }}
                    >
                      Remove
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
          <h2>Add client</h2>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="client-name">Client name</label>
            <input
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Industries"
            />
          </div>
          <div className="field-group">
            <label htmlFor="client-value">Contract value (₹)</label>
            <input
              id="client-value"
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="2500000"
            />
          </div>
          <div className="field-group">
            <label htmlFor="client-rep">Sales rep (optional)</label>
            <input
              id="client-rep"
              value={rep}
              onChange={(e) => setRep(e.target.value)}
              placeholder="Unassigned"
            />
          </div>

          <div className="modal-footer">
            <button type="submit" className="primary-button sm">
              Add client
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

