import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function Signup() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signup(name, email, password)
    } catch (err) {
      const errData = err?.response?.data?.error
      if (typeof errData === 'object') {
        const first = Object.values(errData)[0]
        setError(Array.isArray(first) ? first[0] : JSON.stringify(first))
      } else {
        setError(errData || 'Signup failed. Try again.')
      }
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
            start your archive
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Name
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-line rounded-sm px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:border-ink/40 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Email
            </label>
            <input
              type="email"
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
              placeholder="min. 6 characters"
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="font-mono text-[11px] text-muted text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-ink underline underline-offset-2">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
