import { useState, useEffect, useRef } from 'react'

const HINTS = [
  { example: 'tag:design', desc: 'Filter by tag' },
  { example: 'site:youtube.com', desc: 'Filter by site' },
  { example: 'type:youtube', desc: 'By content type' },
  { example: '"exact phrase"', desc: 'Exact match' },
  { example: 'cats || dogs', desc: 'OR search' },
  { example: '-exclude', desc: 'Exclude a word' },
]

export default function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('')
  const [showHints, setShowHints] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handle = setTimeout(() => { query.trim() ? onSearch(query.trim()) : onClear() }, 350)
    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setShowHints(false) }
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
          placeholder="Search your archive…"
          className="w-full bg-white border border-line rounded-full px-4 py-2 text-[13px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent/60 transition-colors"
        />
        {query && (
          <button onClick={() => { setQuery(''); onClear(); }} className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted hover:text-ink">
            clear
          </button>
        )}
      </div>
      {showHints && !query && (
        <div className="absolute top-10 left-0 right-0 bg-white border border-line rounded-lg shadow-xl z-[100] overflow-hidden">
          {HINTS.map((h) => (
            <button key={h.example} type="button" onClick={() => { setQuery(h.example); setShowHints(false) }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#F0EFE9] transition-colors">
              <span className="text-[12px] text-muted">{h.desc}</span>
              <span className="font-mono text-[10px] bg-[#F0EFE9] text-ink px-1.5 py-0.5 rounded">{h.example}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
