import { motion } from 'framer-motion'

const TAGS = ['design', 'reference']

export default function SpecimenCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[280px] bg-white border border-line rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] select-none"
    >
      {/* top label strip, like an index-card header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-line/70">
        <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
          No. 0412
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      </div>

      {/* image area */}
      <div className="h-36 bg-gradient-to-br from-[#EFEDE6] to-[#E2E0D6] overflow-hidden">
        <svg viewBox="0 0 280 144" className="w-full h-full opacity-90">
          <polygon points="40,110 140,40 240,110 140,144" fill="#D8D5C8" />
          <polygon points="40,110 140,40 140,144 70,144" fill="#CFCBBC" />
          <circle cx="140" cy="40" r="3" fill="#2E5BFF" />
        </svg>
      </div>

      {/* body */}
      <div className="px-4 py-3 space-y-2">
        <p className="font-serif text-[15px] leading-snug text-ink">
          Notes on isometric grid construction
        </p>
        <p className="font-mono text-[10px] text-muted">
          saved from behance.net
        </p>
        <div className="flex gap-1.5 pt-1">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 border border-line rounded-full text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
