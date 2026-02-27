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
      await updateProduct(editingProductId, {
        name: productName,
        techStack: productTechStack,
        revenue: numericRevenue,
      })
    } else {
      await addProduct({
        name: productName,
        techStack: productTechStack,
        revenue: numericRevenue,
      })
    }

    resetForm()
  }

  return (
    <div className="page-grid">
      <section className="card span-3">
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
                <th className="table-actions-col">Actions</th>
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

      <section className="card span-1">
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
            {editingProductId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel edit
              </button>
            )}
            <button type="submit" className="primary-button sm">
              {editingProductId ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

