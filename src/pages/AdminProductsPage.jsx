import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../firebase/productService'
import { seedProducts } from '../firebase/seedProducts'
import './AdminProductsPage.css'

const BLANK = { title: '', description: '', price: '', category: '', image: '', ratingRate: '', ratingCount: '' }

export default function AdminProductsPage() {
  const queryClient = useQueryClient()

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  })

  // ── Add / Edit form ────────────────────────────────────────
  const [form, setForm] = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [formError, setFormError] = useState('')
  const [formSaving, setFormSaving] = useState(false)

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function startEdit(product) {
    setEditId(product.id)
    setForm({
      title: product.title ?? '',
      description: product.description ?? '',
      price: String(product.price ?? ''),
      category: product.category ?? '',
      image: product.image ?? '',
      ratingRate: String(product.rating?.rate ?? ''),
      ratingCount: String(product.rating?.count ?? ''),
    })
    setFormError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(BLANK)
    setFormError('')
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      setFormError('Please enter a valid price.')
      return
    }

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      price,
      category: form.category.trim(),
      image: form.image.trim(),
      rating: {
        rate: parseFloat(form.ratingRate) || 0,
        count: parseInt(form.ratingCount) || 0,
      },
    }

    setFormSaving(true)
    setFormError('')
    try {
      if (editId) {
        await updateProduct(editId, data)
      } else {
        await createProduct(data)
      }
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      cancelEdit()
    } catch {
      setFormError('Save failed. Please try again.')
    } finally {
      setFormSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState(null)

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    } catch {
      alert('Delete failed.')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Seed ───────────────────────────────────────────────────
  const [seedStatus, setSeedStatus] = useState('')
  const [seeding, setSeeding] = useState(false)

  async function handleSeed() {
    setSeeding(true)
    setSeedStatus('')
    try {
      const result = await seedProducts((msg) => setSeedStatus(msg))
      setSeedStatus(result.message)
      if (!result.skipped) {
        await queryClient.invalidateQueries({ queryKey: ['products'] })
      }
    } catch (err) {
      setSeedStatus(`Error: ${err.message}`)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-inner">
        <div className="admin-header">
          <h1 className="admin-title">Product Management</h1>
          <div className="admin-seed">
            <button className="admin-seed-btn" onClick={handleSeed} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Seed from FakeStore API'}
            </button>
            {seedStatus && <p className="admin-seed-status">{seedStatus}</p>}
          </div>
        </div>

        {/* ── Add / Edit Form ─────────────────────────────── */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">
            {editId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form className="admin-form" onSubmit={handleFormSubmit}>
            {formError && <p className="auth-error">{formError}</p>}

            <div className="admin-form-grid">
              <div className="auth-field admin-field-full">
                <label className="auth-label">Title *</label>
                <input className="auth-input" value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="Product title" required />
              </div>

              <div className="auth-field admin-field-full">
                <label className="auth-label">Description</label>
                <textarea className="auth-input admin-textarea" value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Product description" rows={3} />
              </div>

              <div className="auth-field">
                <label className="auth-label">Price ($) *</label>
                <input className="auth-input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="0.00" required />
              </div>

              <div className="auth-field">
                <label className="auth-label">Category</label>
                <input className="auth-input" value={form.category} onChange={(e) => setField('category', e.target.value)} placeholder="e.g. electronics" />
              </div>

              <div className="auth-field admin-field-full">
                <label className="auth-label">Image URL</label>
                <input className="auth-input" value={form.image} onChange={(e) => setField('image', e.target.value)} placeholder="https://…" />
              </div>

              <div className="auth-field">
                <label className="auth-label">Rating (0–5)</label>
                <input className="auth-input" type="number" step="0.1" min="0" max="5" value={form.ratingRate} onChange={(e) => setField('ratingRate', e.target.value)} placeholder="4.5" />
              </div>

              <div className="auth-field">
                <label className="auth-label">Rating Count</label>
                <input className="auth-input" type="number" min="0" value={form.ratingCount} onChange={(e) => setField('ratingCount', e.target.value)} placeholder="120" />
              </div>
            </div>

            <div className="admin-form-actions">
              <button className="auth-submit admin-save-btn" type="submit" disabled={formSaving}>
                {formSaving ? 'Saving…' : editId ? 'Update Product' : 'Add Product'}
              </button>
              {editId && (
                <button className="profile-cancel-btn" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── Product Table ────────────────────────────────── */}
        <section className="admin-table-section">
          <h2 className="admin-section-title">
            All Products {products ? `(${products.length})` : ''}
          </h2>

          {isLoading && <p className="admin-loading">Loading products…</p>}
          {isError && <p className="auth-error">Failed to load products.</p>}

          {products && products.length === 0 && (
            <p className="admin-empty">No products yet. Use the seed button above to import from FakeStore API.</p>
          )}

          {products && products.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className={editId === p.id ? 'admin-row--editing' : ''}>
                      <td>
                        <img
                          src={p.image || 'https://via.placeholder.com/48x48/1a1714/c9a84c?text=LUXE'}
                          alt={p.title}
                          className="admin-product-img"
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48x48/1a1714/c9a84c?text=LUXE' }}
                        />
                      </td>
                      <td className="admin-product-title">{p.title}</td>
                      <td><span className="admin-category-badge">{p.category}</span></td>
                      <td className="admin-product-price">${Number(p.price).toFixed(2)}</td>
                      <td>{p.rating?.rate ?? '—'} ★</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-edit-btn" onClick={() => startEdit(p)}>Edit</button>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                          >
                            {deletingId === p.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
