import { motion } from 'framer-motion'

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return null }
}

export default function DriftCard({ item, onKeep, onForget, onClick, direction }) {
  const domain = getDomain(item.url)

  const variants = {
    enter: (dir) => ({
      x: dir === 'left' ? 300 : dir === 'right' ? -300 : 0,
      opacity: 0,
      scale: 0.92,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exitLeft: { x: -350, opacity: 0, scale: 0.88, rotate: -8 },
    exitRight: { x: 350, opacity: 0, scale: 0.88, rotate: 8 },
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* card */}
      <motion.div
        key={item._id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={onClick}
        className="cursor-pointer bg-white rounded-md shadow-xl overflow-hidden"
        style={{ width: 360, maxHeight: 500 }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* image / thumbnail */}
        {(item.type === 'link' || item.type === 'image') && item.thumbnailUrl && (
          <img
            src={item.thumbnailUrl}
            alt=""
            className="w-full object-cover"
            style={{ maxHeight: 280 }}
            onError={e => e.target.style.display = 'none'}
          />
        )}

        <div className="p-5">
          {/* type badge */}
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted block mb-2">
            {item.type}
          </span>

          {/* title */}
          {item.title && (
            <p className="font-serif text-[17px] leading-snug text-ink mb-2 line-clamp-3">
              {item.title}
            </p>
          )}

          {/* note/quote content */}
          {(item.type === 'note' || item.type === 'quote') && item.content && (
            <p className={`text-[14px] leading-relaxed text-muted line-clamp-4 ${item.type === 'quote' ? 'italic' : ''}`}>
              {item.type === 'quote' ? `"${item.content}"` : item.content}
            </p>
          )}

          {/* domain */}
          {domain && (
            <div className="flex items-center gap-1.5 mt-3">
              {item.faviconUrl && <img src={item.faviconUrl} alt="" className="w-3.5 h-3.5" />}
              <span className="font-mono text-[10px] text-muted">{domain}</span>
            </div>
          )}

          {/* tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 4).map(tag => (
                <span key={tag} className="font-mono text-[9px] text-muted border border-line px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* tap hint */}
          <p className="font-mono text-[9px] text-muted/50 mt-4 text-center">
            tap to open
          </p>
        </div>
      </motion.div>

      {/* action buttons */}
      <div className="flex items-center gap-8">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={onForget}
          className="flex flex-col items-center gap-2"
        >
          <span className="w-16 h-16 rounded-full bg-white/80 border border-line shadow-md flex items-center justify-center text-[22px]">
            ✕
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Forget</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={onKeep}
          className="flex flex-col items-center gap-2"
        >
          <span className="w-16 h-16 rounded-full bg-white/90 border border-line shadow-md flex items-center justify-center text-[22px]">
            ✓
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Keep</span>
        </motion.button>
      </div>

      {/* keyboard hint */}
      <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
        ← forget &nbsp;&nbsp; keep →
      </p>
    </div>
  )
}
