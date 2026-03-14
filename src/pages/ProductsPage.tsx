import { useState, type FormEvent } from 'react'
import { useAppData } from '../state/AppDataContext'

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppData()

  const [productName, setProductName] = useState('')
  const [productTechStack, setProductTechStack] = useState('')
  const [productRevenue, setProductRevenue] = useState('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  const resetForm = () => {
    setProductName('')
    setProductTechStack('')
    setProductRevenue('')
    setEditingProductId(null)
  }

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productName) return
    const numericRevenue = productRevenue ? Number(productRevenue) : 0
    if (Number.isNaN(numericRevenue)) return

    if (editingProductId) {
      await updateProduct(editingProductId, { name: productName, techStack: productTechStack, revenue: numericRevenue })
    } else {
      await addProduct({ name: productName, techStack: productTechStack, revenue: numericRevenue })
    }
    resetForm()
  }

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0)

  return (
    <div className="page-grid">
      {/* Stats */}
      <section className="card span-4">
        <div className="card-header">
          <h2>Product Catalogue</h2>
          <p className="card-subtitle">Manage your products, tech stacks, and revenue tracking.</p>
        </div>
        <div className="overview-grid three">
          <div className="stat-card">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-meta">In catalogue</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">
              {totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-meta positive">Monthly from all products</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Revenue</div>
            <div className="stat-value">
              {products.length > 0
                ? Math.round(totalRevenue / products.length).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                : '—'}
            </div>
            <div className="stat-meta">Per product</div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="card span-3">
        <div className="card-header">
          <h2>Products</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Tech Stack</th>
                <th>Revenue (₹/mo)</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td><span className="pill pill-info">{product.techStack || 'Not specified'}</span></td>
                  <td>
                    {product.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </td>
                  <td className="table-actions-col">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        setProductName(product.name)
                        setProductTechStack(product.techStack)
                        setProductRevenue(String(product.revenue))
                        setEditingProductId(product.id)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button danger"
                      onClick={() => { if (window.confirm(`Delete "${product.name}"?`)) void deleteProduct(product.id) }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-state-icon">📦</div><div className="empty-state-title">No products yet</div><div className="empty-state-text">Add your first product.</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Form */}
      <section className="card span-1">
        <div className="card-header"><h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2></div>
        <form className="modal-form" onSubmit={handleAddProduct}>
          <div className="field-group">
            <label htmlFor="product-name">Product Name</label>
            <input id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Attendance Portal" />
          </div>
          <div className="field-group">
            <label htmlFor="product-tech">Tech Stack</label>
            <input id="product-tech" value={productTechStack} onChange={(e) => setProductTechStack(e.target.value)} placeholder="React, Node, MongoDB" />
          </div>
          <div className="field-group">
            <label htmlFor="product-revenue">Monthly Revenue (₹)</label>
            <input id="product-revenue" type="number" min="0" value={productRevenue} onChange={(e) => setProductRevenue(e.target.value)} placeholder="500000" />
          </div>
          <div className="modal-footer">
            {editingProductId && (
              <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
            )}
            <button type="submit" className="primary-button sm">
              {editingProductId ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
