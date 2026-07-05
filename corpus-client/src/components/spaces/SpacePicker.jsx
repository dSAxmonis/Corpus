import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchSpaces } from '../../api/spaces.js'

export default function SpacePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { data } = useQuery({ queryKey: ['spaces'], queryFn: fetchSpaces })
  const spaces = data?.spaces || []
  const selected = spaces.find(s => s._id === value)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 font-mono text-[11px] border border-line rounded-full px-3 py-1.5 hover:border-ink/30 transition-colors"
      >
        {selected ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: selected.color }} />
            <span className="text-ink">{selected.name}</span>
          </>
        ) : (
          <span className="text-muted">No space</span>
        )}
        <span className="text-muted text-[9px]">⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 top-9 bg-white border border-line rounded-md shadow-lg w-48 py-1.5 z-30 max-h-56 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onChange(null); setOpen(false) }}
            className="w-full text-left px-3 py-1.5 font-mono text-[11px] text-muted hover:bg-[#F0EFE9] transition-colors"
          >
            No space
          </button>
          {spaces.map(s => (
            <button
              key={s._id}
              type="button"
              onClick={() => { onChange(s._id); setOpen(false) }}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 font-mono text-[11px] text-ink hover:bg-[#F0EFE9] transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full border-2 shrink-0" style={{ borderColor: s.color }} />
              <span className="truncate">{s.name}</span>
            </button>
          ))}
          {spaces.length === 0 && (
            <p className="px-3 py-2 font-mono text-[10px] text-muted">No spaces yet</p>
          )}
        </div>
      )}
    </div>
  )
}
