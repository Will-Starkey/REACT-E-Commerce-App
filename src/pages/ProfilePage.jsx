import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserDoc, updateUserDoc } from '../firebase/userService'
import { deleteUserAccount } from '../firebase/authService'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: () => getUserDoc(user.uid),
    enabled: !!user,
  })

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: '',
  })

  function startEdit() {
    setForm({
      name: profile?.name ?? '',
      street: profile?.address?.street ?? '',
      city: profile?.address?.city ?? '',
      state: profile?.address?.state ?? '',
      zip: profile?.address?.zip ?? '',
      country: profile?.address?.country ?? '',
    })
    setEditing(true)
    setSaveError('')
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      await updateUserDoc(user.uid, {
        name: form.name,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      })
      await queryClient.invalidateQueries({ queryKey: ['profile', user.uid] })
      setEditing(false)
    } catch {
      setSaveError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Delete account
  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(e) {
    e.preventDefault()
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteUserAccount(deletePassword)
      navigate('/')
    } catch (err) {
      setDeleteError(
        err.code === 'auth/wrong-password'
          ? 'Incorrect password.'
          : 'Failed to delete account. Please try again.'
      )
    } finally {
      setDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-inner">
          <div className="auth-loading"><div className="auth-loading-spinner" /></div>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-inner">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-email">{user?.email}</p>

        {!editing ? (
          <div className="profile-view">
            <div className="profile-section">
              <h2 className="profile-section-title">Personal Info</h2>
              <p className="profile-field">
                <span className="profile-field-label">Name</span>
                <span>{profile?.name || '—'}</span>
              </p>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">Shipping Address</h2>
              {profile?.address?.street ? (
                <>
                  <p className="profile-field">
                    <span className="profile-field-label">Street</span>
                    <span>{profile.address.street}</span>
                  </p>
                  <p className="profile-field">
                    <span className="profile-field-label">City</span>
                    <span>{profile.address.city}</span>
                  </p>
                  <p className="profile-field">
                    <span className="profile-field-label">State</span>
                    <span>{profile.address.state}</span>
                  </p>
                  <p className="profile-field">
                    <span className="profile-field-label">ZIP</span>
                    <span>{profile.address.zip}</span>
                  </p>
                  <p className="profile-field">
                    <span className="profile-field-label">Country</span>
                    <span>{profile.address.country}</span>
                  </p>
                </>
              ) : (
                <p className="profile-empty">No address saved.</p>
              )}
            </div>

            <button className="profile-edit-btn" onClick={startEdit}>Edit Profile</button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            {saveError && <p className="auth-error">{saveError}</p>}

            <div className="profile-section">
              <h2 className="profile-section-title">Personal Info</h2>
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input className="auth-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" />
              </div>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">Shipping Address</h2>
              <div className="auth-field">
                <label className="auth-label">Street</label>
                <input className="auth-input" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="123 Main St" />
              </div>
              <div className="profile-form-row">
                <div className="auth-field">
                  <label className="auth-label">City</label>
                  <input className="auth-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="New York" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">State</label>
                  <input className="auth-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="NY" />
                </div>
              </div>
              <div className="profile-form-row">
                <div className="auth-field">
                  <label className="auth-label">ZIP</label>
                  <input className="auth-input" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="10001" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Country</label>
                  <input className="auth-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="USA" />
                </div>
              </div>
            </div>

            <div className="profile-form-actions">
              <button className="auth-submit" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button className="profile-cancel-btn" type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Delete Account */}
        <div className="profile-danger-zone">
          <h2 className="profile-danger-title">Danger Zone</h2>
          {!showDelete ? (
            <button className="profile-delete-btn" onClick={() => setShowDelete(true)}>
              Delete Account
            </button>
          ) : (
            <form className="profile-delete-form" onSubmit={handleDelete}>
              <p className="profile-delete-warning">
                This will permanently delete your account and all your data. Enter your password to confirm.
              </p>
              {deleteError && <p className="auth-error">{deleteError}</p>}
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="profile-form-actions">
                <button className="profile-delete-confirm-btn" type="submit" disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
                </button>
                <button className="profile-cancel-btn" type="button" onClick={() => setShowDelete(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
