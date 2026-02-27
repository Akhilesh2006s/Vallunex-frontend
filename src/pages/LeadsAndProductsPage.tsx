import { useState, type FormEvent } from 'react'
import {
  useAppData,
  type LeadTemperature,
  type LeadStatus,
  type LeadValuePeriod,
} from '../state/AppDataContext'

export function LeadsAndProductsPage() {
  const { leads, products, addLead, updateLead, addProduct, deleteProduct, convertLeadToClient, deleteLead } =
    useAppData()

  const pipelineLeads = leads.filter((lead) => lead.status !== 'Client')

  const [leadName, setLeadName] = useState('')
  const [leadValue, setLeadValue] = useState('')
  const [leadRep, setLeadRep] = useState('')
  const [leadTemperature, setLeadTemperature] = useState<LeadTemperature>('Cold')
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New')
  const [leadValuePeriod, setLeadValuePeriod] = useState<LeadValuePeriod>('Monthly')

  const [productName, setProductName] = useState('')
  const [productTechStack, setProductTechStack] = useState('')
  const [productRevenue, setProductRevenue] = useState('')

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

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productName) return

    const numericRevenue = productRevenue ? Number(productRevenue) : 0
    if (Number.isNaN(numericRevenue)) return

    await addProduct({
      name: productName,
      techStack: productTechStack,
      revenue: numericRevenue,
    })

    setProductName('')
    setProductTechStack('')
    setProductRevenue('')
  }

  const handleTemperatureChange = (leadId: string, temperature: LeadTemperature) => {
    void updateLead(leadId, { temperature })
  }

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    void updateLead(leadId, { status })
  }

  return (
    <div className="page-grid">
      <section className="card span-3">
        <div className="card-header with-actions">
          <div>
            <h2>Leads</h2>
            <p className="card-subtitle">Track cold, warm and hot leads until they are ready to become clients.</p>
          </div>
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
              {pipelineLeads.map((lead) => (
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

      <section className="card span-2">
        <div className="card-header with-actions">
          <div>
            <h2>Products</h2>
            <p className="card-subtitle">Catalogue of products and revenue by product.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Tech stack</th>
                <th>Revenue (₹)</th>
                <th className="table-actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.techStack}</td>
                  <td>
                    {product.revenue.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        const ok = window.confirm(`Delete product "${product.name}"?`)
                        if (!ok) return
                        void deleteProduct(product.id)
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

      <section className="card span-2">
        <div className="card-header">
          <h2>Add product</h2>
        </div>
        <form className="modal-form" onSubmit={handleAddProduct}>
          <div className="field-group">
            <label htmlFor="product-name">Product name</label>
            <input
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Attendance portal"
            />
          </div>
          <div className="field-group">
            <label htmlFor="product-tech">Tech stack</label>
            <input
              id="product-tech"
              value={productTechStack}
              onChange={(e) => setProductTechStack(e.target.value)}
              placeholder="React, Node, MongoDB"
            />
          </div>
          <div className="field-group">
            <label htmlFor="product-revenue">Monthly revenue (₹)</label>
            <input
              id="product-revenue"
              type="number"
              min="0"
              value={productRevenue}
              onChange={(e) => setProductRevenue(e.target.value)}
              placeholder="500000"
            />
          </div>

          <div className="modal-footer">
            <button type="submit" className="primary-button sm">
              Add product
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

