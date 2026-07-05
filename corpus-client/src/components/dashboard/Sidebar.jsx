import { useAuth } from '../../hooks/useAuth.js'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'

const TYPE_FILTERS = [
  { value: '', label: 'All entries' },
  { value: 'link', label: 'Links' },
  { value: 'note', label: 'Notes' },
  { value: 'quote', label: 'Quotes' },
  { value: 'image', label: 'Images' },
]

export default function Sidebar({ activeType, onTypeChange, activeTag, onTagChange }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const credits = useAuthStore(s => s.credits)

  const creditsLeft = credits ?? user?.credits ?? 0
  const isLow = creditsLeft <= 20
  const isEmpty = creditsLeft <= 0
  const creditsPercent = Math.min(100, Math.max(0, (creditsLeft / 100) * 100))
  const isDashboard = location.pathname === '/dashboard'

  function handleTypeChange(val) {
    if (!isDashboard) navigate('/dashboard')
    onTypeChange(val)
    onTagChange('')
  }

  return (
    <aside className="w-56 shrink-0 border-r border-line h-screen sticky top-0 hidden md:flex flex-col">

      <div className="px-6 h-16 flex items-center border-b border-line shrink-0">
        <span className="font-serif text-lg">Corpus</span>
      </div>

      <nav className="px-3 py-4 flex-1 overflow-y-auto">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted px-3 pb-2">Browse</p>

        {TYPE_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => handleTypeChange(f.value)}
            className={`w-full text-left px-3 py-2 rounded-sm text-[13.5px] transition-colors block mb-0.5 ${
              isDashboard && activeType === f.value && !activeTag
                ? 'bg-ink text-paper'
                : 'text-ink hover:bg-[#F0EFE9]'
            }`}
          >
            {f.label}
          </button>
        ))}

        <div className="h-4" />

        <button
          onClick={() => navigate('/drift')}
          className={`w-full text-left px-3 py-2 rounded-sm text-[13.5px] transition-colors flex items-center gap-2 mb-0.5 ${
            location.pathname === '/drift' ? 'bg-ink text-paper' : 'text-ink hover:bg-[#F0EFE9]'
          }`}
        >
          <span>✦</span> Drift
        </button>

        <button
          onClick={() => navigate('/spaces')}
          className={`w-full text-left px-3 py-2 rounded-sm text-[13.5px] transition-colors flex items-center gap-2 mb-0.5 ${
            location.pathname.startsWith('/spaces') ? 'bg-ink text-paper' : 'text-ink hover:bg-[#F0EFE9]'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full border-2 border-accent shrink-0" />
          Spaces
        </button>
      </nav>

      <div className="px-4 py-4 border-t border-line shrink-0 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Saves left</span>
            <span className="font-mono text-[11px]" style={{ color: isEmpty ? '#DC2626' : isLow ? '#F97316' : '#171717' }}>
              {creditsLeft}
            </span>
          </div>
          <div className="h-1 bg-line rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${creditsPercent}%`, backgroundColor: isEmpty ? '#DC2626' : isLow ? '#F97316' : '#2E5BFF' }}
            />
          </div>
        </div>

        {(isLow || isEmpty) && (
          <button
            onClick={() => navigate('/pricing')}
            className="w-full font-mono text-[11px] uppercase tracking-wide text-white py-2 rounded-sm"
            style={{ backgroundColor: isEmpty ? '#DC2626' : '#2E5BFF' }}
          >
            {isEmpty ? 'Out of saves' : 'Upgrade plan'}
          </button>
        )}

        {user && <p className="font-mono text-[10px] text-muted truncate">{user.name || user.email}</p>}
        <button onClick={logout} className="w-full text-left font-mono text-[11px] uppercase tracking-wide text-muted hover:text-ink transition-colors">
          Sign out
        </button>
      </div>
    </aside>
  )
}
