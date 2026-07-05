import { useState, useRef, useEffect } from 'react'

export default function TagEditor({ tags = [], onUpdate, compact = false }) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function addTag() {
    const val = input.trim().toLowerCase().replace(/\s+/g, '-')
    if (!val || tags.includes(val)) { setInput(''); return }
    onUpdate([...tags, val])
    setInput('')
  }

  function removeTag(tag) {
    onUpdate(tags.filter(t => t !== tag))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1])
    if (e.key === 'Escape') { setInput(''); setEditing(false) }
  }

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {tags.map(tag => (
        <span key={tag} className="group flex items-center gap-0.5 font-mono text-[9px] text-muted border border-line px-1.5 py-0.5 rounded-full hover:border-ink/30 transition-colors">
          {tag}
          <button
            onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
            className="hidden group-hover:inline text-muted hover:text-red-500 ml-0.5 leading-none"
          >
            ×
          </button>
        </span>
      ))}

      {editing ? (
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { addTag(); setEditing(false) }}
          placeholder="add tag…"
          className="font-mono text-[9px] border-b border-ink/30 outline-none bg-transparent w-16 text-ink placeholder:text-muted"
        />
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true) }}
          className="font-mono text-[9px] text-muted hover:text-ink border border-dashed border-line px-1.5 py-0.5 rounded-full hover:border-ink/30 transition-colors"
        >
          + tag
        </button>
      )}
    </div>
  )
}
