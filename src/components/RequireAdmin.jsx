import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
