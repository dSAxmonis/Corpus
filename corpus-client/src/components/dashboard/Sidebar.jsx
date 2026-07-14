import { useAuth } from '../../hooks/useAuth.js'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import {
  FiGrid, FiLink, FiFileText, FiImage, FiMessageSquare,
  FiZap, FiCircle, FiLogOut, FiTrendingUp,
} from 'react-icons/fi'

const TYPE_FILTERS = [
  { value: '', label: 'All entries', icon: FiGrid },
  { value: 'link', label: 'Links', icon: FiLink },
  { value: 'note', label: 'Notes', icon: FiFileText },
  { value: 'quote', label: 'Quotes', icon: FiMessageSquare },
  { value: 'image', label: 'Images', icon: FiImage },
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
    <aside className="w-60 shrink-0 border-r border-line/70 h-screen sticky top-0 hidden md:flex flex-col bg-paper">

      {/* logo */}
      <div className="px-5 h-16 flex items-center border-b border-line/70 shrink-0">
        <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center mr-2.5">
          <span className="text-paper font-serif text-[14px] italic">C</span>
        </div>
        <span className="font-serif text-[17px]">Corpus</span>
      </div>

      <nav className="px-3 py-5 flex-1 overflow-y-auto">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted/70 px-2.5 pb-2">Browse</p>

        <div className="space-y-0.5 mb-5">
          {TYPE_FILTERS.map(f => {
            const active = isDashboard && activeType === f.value && !activeTag
            return (
              <button
                key={f.value}
                onClick={() => handleTypeChange(f.value)}
                className={`w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg text-[13px] transition-all ${
                  active
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-ink/80 hover:bg-[#EFEDE5]'
                }`}
              >
                <f.icon className={`text-[14px] shrink-0 ${active ? 'text-paper' : 'text-muted'}`} />
                <span className="truncate">{f.label}</span>
              </button>
            )
          })}
        </div>

        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted/70 px-2.5 pb-2">Explore</p>

        <div className="space-y-0.5">
          <button
            onClick={() => navigate('/drift')}
            className={`w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg text-[13px] transition-all ${
              location.pathname === '/drift'
                ? 'bg-ink text-paper shadow-sm'
                : 'text-ink/80 hover:bg-[#EFEDE5]'
            }`}
          >
            <FiZap className={`text-[14px] shrink-0 ${location.pathname === '/drift' ? 'text-paper' : 'text-accent'}`} />
            <span>Drift</span>
          </button>

          <button
            onClick={() => navigate('/spaces')}
            className={`w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg text-[13px] transition-all ${
              location.pathname.startsWith('/spaces')
                ? 'bg-ink text-paper shadow-sm'
                : 'text-ink/80 hover:bg-[#EFEDE5]'
            }`}
          >
            <FiCircle className={`text-[13px] shrink-0 ${location.pathname.startsWith('/spaces') ? 'text-paper' : 'text-accent'}`} />
            <span>Spaces</span>
          </button>
        </div>
      </nav>

      {/* credits + user */}
      <div className="p-3 border-t border-line/70 shrink-0">
        <div className="rounded-xl bg-[#F3F1EA] p-3 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted flex items-center gap-1">
              <FiTrendingUp className="text-[10px]" /> Saves left
            </span>
            <span
              className="font-mono text-[11px] font-medium"
              style={{ color: isEmpty ? '#DC2626' : isLow ? '#EA580C' : '#171717' }}
            >
              {creditsLeft}
            </span>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${creditsPercent}%`,
                backgroundColor: isEmpty ? '#DC2626' : isLow ? '#EA580C' : '#2E5BFF',
              }}
            />
          </div>
          {(isLow || isEmpty) && (
            <button
              onClick={() => navigate('/pricing')}
              className="w-full mt-2.5 font-mono text-[10px] uppercase tracking-wide text-white py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: isEmpty ? '#DC2626' : '#2E5BFF' }}
            >
              {isEmpty ? 'Out of saves' : 'Upgrade plan'}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between px-1">
          {user && (
            <p className="font-mono text-[10px] text-muted truncate flex-1">{user.name || user.email}</p>
          )}
          <button
            onClick={logout}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#EFEDE5] text-muted hover:text-ink transition-colors shrink-0"
            title="Sign out"
          >
            <FiLogOut className="text-[12px]" />
          </button>
        </div>
      </div>
    </aside>
  )
}
