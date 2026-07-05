import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-10 text-center">
          <Link to="/" className="font-serif text-2xl text-ink">Corpus</Link>
          <p className="font-mono text-[11px] text-muted mt-1 uppercase tracking-wider">
            sign in to your archive
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-sm px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:border-ink/40 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-sm px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:border-ink/40 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[12.5px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper font-mono text-[12px] uppercase tracking-wide py-3 rounded-sm hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="font-mono text-[11px] text-muted text-center mt-6">
          No account?{' '}
          <Link to="/signup" className="text-ink underline underline-offset-2">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
