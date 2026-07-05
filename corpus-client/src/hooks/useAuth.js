import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import { loginApi, signupApi, logoutApi, refreshApi } from '../api/auth.js'

export function useAuth() {
  const { user, accessToken, isLoading, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(async (email, password) => {
    const data = await loginApi(email, password)
    setAuth(data.user, data.accessToken)
    navigate('/dashboard')
  }, [setAuth, navigate])

  const signup = useCallback(async (name, email, password) => {
    const data = await signupApi(name, email, password)
    setAuth(data.user, data.accessToken)
    navigate('/dashboard')
  }, [setAuth, navigate])

  const logout = useCallback(async () => {
    try { await logoutApi() } catch { /* ignore */ }
    clearAuth()
    navigate('/login')
  }, [clearAuth, navigate])

  return { user, accessToken, isLoading, login, signup, logout }
}
