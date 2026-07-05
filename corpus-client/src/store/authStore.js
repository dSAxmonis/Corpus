import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  credits: null,

  setAuth: (user, accessToken) => set({
    user,
    accessToken,
    isLoading: false,
    credits: user?.credits ?? null,
  }),
  setCredits: (credits) => set((s) => ({
    credits,
    user: s.user ? { ...s.user, credits } : s.user,
  })),
  clearAuth: () => set({ user: null, accessToken: null, isLoading: false, credits: null }),
  setLoading: (isLoading) => set({ isLoading }),
}))

export default useAuthStore
