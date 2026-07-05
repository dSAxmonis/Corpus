import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <span className="font-mono text-[12px] uppercase tracking-wider text-muted">
          loading…
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
