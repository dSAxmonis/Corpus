const ENTRIES = [
  { type: 'LINK', label: 'On the discipline of taking notes', meta: 'farnamstreet.com', h: 'h-28' },
  { type: 'QUOTE', label: '\u201cThe palest ink is better than the best memory.\u201d', meta: 'Chinese proverb', h: 'h-20' },
  { type: 'IMAGE', label: 'Reference — type specimen, 1923', meta: 'uploaded', h: 'h-40' },
  { type: 'NOTE', label: 'Idea: weekly review ritual, Sunday 9am', meta: 'written', h: 'h-24' },
  { type: 'LINK', label: 'A short history of the index card', meta: 'theatlantic.com', h: 'h-32' },
  { type: 'IMAGE', label: 'Color study — autumn palette', meta: 'uploaded', h: 'h-28' },
]

export default function ArchivePreview() {
  return (
    <section id="archive" className="border-t border-line">
      <div className="max-w-content mx-auto px-6 py-24">
        <div className="max-w-md mb-14">
          <p className="font-mono text-[12px] uppercase tracking-wider text-accent mb-3">
            The archive
          </p>
          <h2 className="font-serif text-[32px] leading-tight tracking-tightest">
            Everything kept side by side, regardless of kind.
          </h2>
        </div>

        <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
          {ENTRIES.map((entry, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-4 bg-white border border-line rounded-sm overflow-hidden hover:border-ink/30 transition-colors"
            >
              <div className={`${entry.h} bg-[#EFEDE6] flex items-end p-3`}>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted bg-white/80 px-1.5 py-0.5 rounded-sm">
                  {entry.type}
                </span>
              </div>
              <div className="p-3.5">
                <p className="font-serif text-[14px] leading-snug text-ink">
                  {entry.label}
                </p>
                <p className="font-mono text-[10px] text-muted mt-1.5">
                  {entry.meta}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
