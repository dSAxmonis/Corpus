import { useState, useEffect, useRef } from 'react'

const HINTS = [
  { example: 'tag:design', desc: 'Filter by tag' },
  { example: 'site:youtube.com', desc: 'Filter by site' },
  { example: 'type:youtube', desc: 'By content type' },
  { example: 'type:note', desc: 'By item type' },
  { example: '"exact phrase"', desc: 'Exact match' },
  { example: 'cats || dogs', desc: 'OR search' },
  { example: '-exclude', desc: 'Exclude a word' },
  { example: 'yesterday', desc: 'Saved yesterday' },
  { example: 'last week', desc: 'Saved last week' },
]

export default function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('')
  const [showHints, setShowHints] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handle = setTimeout(() => {
      query.trim() ? onSearch(query.trim()) : onClear()
    }, 350)
    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setShowHints(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHints(true)}
          placeholder="Search your archive… (try tag:design or site:youtube.com)"
          className="w-full bg-white border border-line rounded-sm px-4 py-2.5 text-[14px] placeholder:text-muted/60 focus:outline-none focus:border-ink/40 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); onClear(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted hover:text-ink"
          >
            clear
          </button>
        )}
      </div>

      {/* hints dropdown — only when empty and focused */}
      {showHints && !query && (
        <div className="absolute top-11 left-0 right-0 bg-white border border-line rounded-sm shadow-lg z-40 overflow-hidden">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted px-4 pt-3 pb-1">
            Search shortcuts
          </p>
          {HINTS.map((h) => (
            <button
              key={h.example}
              type="button"
              onClick={() => { setQuery(h.example); setShowHints(false) }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#F0EFE9] transition-colors"
            >
              <span className="text-[13px] text-muted">{h.desc}</span>
              <span className="font-mono text-[11px] bg-[#F0EFE9] text-ink px-2 py-0.5 rounded-sm">
                {h.example}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
