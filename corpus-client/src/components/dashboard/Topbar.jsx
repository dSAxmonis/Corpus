import { useState, useRef, useEffect } from 'react'
import SearchBar from './SearchBar.jsx'

export default function Topbar({ onSearch, onClearSearch, onOpenComposer, allTags = [], activeTag, onTagChange }) {
  const [tagsOpen, setTagsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTagsOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="sticky top-0 bg-paper/90 backdrop-blur-sm border-b border-line z-10">
      <div className="px-6 md:px-10 h-16 flex items-center gap-3">

        {/* search */}
        <div className="flex-1 max-w-md">
          <SearchBar onSearch={onSearch} onClear={onClearSearch} />
        </div>

        {/* tags filter */}
        {allTags.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setTagsOpen(o => !o)}
              className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide px-3 py-2 rounded-sm border transition-colors ${
                activeTag
                  ? 'bg-ink text-paper border-ink'
                  : 'border-line text-muted hover:text-ink hover:border-ink/30'
              }`}
            >
              {activeTag ? (
                <>
                  <span>{activeTag}</span>
                  <span
                    onClick={(e) => { e.stopPropagation(); onTagChange(''); setTagsOpen(false) }}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </span>
                </>
              ) : (
                <>
                  <span>#</span>
                  <span>Tags</span>
                </>
              )}
            </button>

            {tagsOpen && (
              <div className="absolute top-11 left-0 bg-white border border-line rounded-sm shadow-lg w-56 max-h-72 overflow-y-auto z-30">
                <div className="p-2">
                  {/* group by first letter */}
                  {Object.entries(
                    allTags.reduce((acc, tag) => {
                      const l = tag[0].toUpperCase()
                      if (!acc[l]) acc[l] = []
                      acc[l].push(tag)
                      return acc
                    }, {})
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([letter, tags]) => (
                      <div key={letter} className="mb-2">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-muted px-2 py-0.5">
                          {letter}
                        </p>
                        {tags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => { onTagChange(tag); setTagsOpen(false) }}
                            className={`w-full text-left px-2 py-1 rounded-sm font-mono text-[12px] transition-colors ${
                              activeTag === tag
                                ? 'bg-ink text-paper'
                                : 'text-ink hover:bg-[#F0EFE9]'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* save button */}
        <button
          onClick={onOpenComposer}
          className="font-mono text-[12px] uppercase tracking-wide bg-ink text-paper px-4 py-2.5 rounded-sm hover:bg-accent transition-colors shrink-0"
        >
          + Save
        </button>
      </div>

      {/* active tag indicator */}
      {activeTag && (
        <div className="px-6 md:px-10 pb-2 flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted">Showing tag:</span>
          <span className="font-mono text-[11px] text-ink">{activeTag}</span>
          <button
            onClick={() => onTagChange('')}
            className="font-mono text-[10px] text-muted hover:text-ink border border-line px-2 py-0.5 rounded-full"
          >
            clear
          </button>
        </div>
      )}
    </div>
  )
}
