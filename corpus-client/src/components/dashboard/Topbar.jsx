import { useState, useRef, useEffect } from 'react'
import { FiPlus, FiHash } from 'react-icons/fi'
import SearchBar from './SearchBar.jsx'

export default function Topbar({ onSearch, onClearSearch, onOpenComposer, allTags = [], activeTag, onTagChange }) {
  const [tagsOpen, setTagsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handle(e) { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setTagsOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="sticky top-0 bg-paper/90 backdrop-blur-md border-b border-line/70 z-50">
      <div className="px-5 md:px-8 h-14 flex items-center gap-2.5">
        <div className="flex-1 max-w-sm">
          <SearchBar onSearch={onSearch} onClear={onClearSearch} />
        </div>

        {allTags.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setTagsOpen(o => !o)}
              className={`flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wide px-3 py-2 rounded-full border transition-colors ${
                activeTag ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:text-ink hover:border-ink/30 bg-white'
              }`}
            >
              <FiHash className="text-[11px]" />
              {activeTag ? (
                <>
                  <span>{activeTag}</span>
                  <span onClick={(e) => { e.stopPropagation(); onTagChange(''); setTagsOpen(false) }} className="ml-1 hover:text-red-400">×</span>
                </>
              ) : <span>Tags</span>}
            </button>

            {tagsOpen && (
              <div className="absolute top-10 left-0 bg-white border border-line rounded-lg shadow-xl w-52 max-h-64 overflow-y-auto z-[100] p-1.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { onTagChange(tag); setTagsOpen(false) }}
                    className={`w-full text-left px-2 py-1.5 rounded-md font-mono text-[11.5px] transition-colors ${
                      activeTag === tag ? 'bg-ink text-paper' : 'text-ink hover:bg-[#F0EFE9]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onOpenComposer}
          className="font-mono text-[11px] uppercase tracking-wide bg-ink text-paper px-3.5 py-2 rounded-full hover:bg-accent transition-colors shrink-0 flex items-center gap-1.5"
        >
          <FiPlus className="text-[12px]" />
          Save
        </button>
      </div>
    </div>
  )
}
