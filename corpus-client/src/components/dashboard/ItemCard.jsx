import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../api/axios.js'

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  const dy = Math.floor(h / 24); if (dy < 30) return `${dy}d ago`
  return new Date(d).toLocaleDateString()
}

function isRecent(dateStr) {
  return Date.now() - new Date(dateStr).getTime() < 2 * 60 * 1000
}

export default function ItemCard({ item: initialItem, onClick, onDelete }) {
  const [item, setItem] = useState(initialItem)
  const [hovered, setHovered] = useState(false)
  const shouldScan = !item.summary && isRecent(item.createdAt)

  useEffect(() => {
    if (!shouldScan) return
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/items/${item._id}`)
        if (data.item.summary) { setItem(data.item); clearInterval(interval) }
      } catch {}
    }, 3000)
    return () => clearInterval(interval)
  }, [item._id, shouldScan])

  const domain = (() => {
    try { return new URL(item.url).hostname.replace('www.', '') } catch { return null }
  })()

  function handleDeleteClick(e) {
    e.stopPropagation()
    onDelete(item._id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
      className="break-inside-avoid mb-4 bg-white rounded-sm overflow-hidden cursor-pointer relative group"
      style={shouldScan ? {} : { border: '1px solid #E4E4E0' }}
    >
      {shouldScan && (
        <div className="absolute inset-0 rounded-sm pointer-events-none z-10" style={{ padding: '1px' }}>
          <svg className="absolute inset-0 w-full h-full rounded-sm" style={{ overflow: 'visible' }}>
            <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="3" ry="3"
              fill="none" stroke="#2E5BFF" strokeWidth="1.5" strokeDasharray="60 200" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" from="0" to="-260" dur="1.6s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
      )}

      {/* quick delete on hover */}
      {hovered && !shouldScan && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2.5 right-2.5 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/95 border border-line text-muted hover:text-red-600 hover:border-red-200 transition-colors font-mono text-[12px] shadow-sm"
          title="Delete"
        >
          ×
        </button>
      )}

      <div className="px-3.5 pt-3 pb-1.5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted">{item.type}</span>
      </div>

      {(item.type === 'link' || item.type === 'image') && item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt="" className="w-full h-auto object-cover" loading="lazy"
          onError={e => e.target.style.display = 'none'} />
      )}

      <div className="px-3.5 pt-2 pb-1">
        {item.title && <p className="font-serif text-[14px] leading-snug line-clamp-2 text-ink">{item.title}</p>}
        {(item.type === 'note' || item.type === 'quote') && item.content && (
          <p className={`text-[13.5px] leading-relaxed text-ink line-clamp-3 mt-0.5 ${item.type === 'quote' ? 'font-serif italic' : ''}`}>
            {item.type === 'quote' ? `"${item.content}"` : item.content}
          </p>
        )}
        {item.type === 'link' && domain && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {item.faviconUrl && <img src={item.faviconUrl} alt="" className="w-3 h-3" />}
            <span className="font-mono text-[10px] text-muted">{domain}</span>
          </div>
        )}
      </div>

      <div className="px-3.5 pb-3 pt-1.5 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="font-mono text-[9px] text-muted border border-line px-1.5 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <span className="font-mono text-[9px] text-muted shrink-0">{timeAgo(item.createdAt)}</span>
      </div>
    </motion.div>
  )
}
