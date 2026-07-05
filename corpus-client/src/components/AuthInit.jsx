import { useEffect, useRef } from 'react'
import axios from 'axios'
import useAuthStore from '../store/authStore.js'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function AuthInit({ children }) {
  const { setAuth, clearAuth } = useAuthStore()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function restore() {
      try {
        const { data: refreshData } = await axios.post(
          `${BASE}/auth/refresh`,
          {},
          { withCredentials: true, timeout: 5000 }
        )
        const { data: meData } = await axios.get(`${BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${refreshData.accessToken}` },
          withCredentials: true,
          timeout: 5000,
        })
        setAuth(meData.user, refreshData.accessToken)
      } catch {
        clearAuth()
      }
    }

    restore()
  }, [])

  return children
}
