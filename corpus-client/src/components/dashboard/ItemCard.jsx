import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiTrash2 } from 'react-icons/fi'
import api from '../../api/axios.js'
import AIGradientBorder from './AIGradientBorder.jsx'
import { getContentTypeIcon } from '../../utils/contentTypeIcons.jsx'

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h`
  const dy = Math.floor(h / 24); if (dy < 30) return `${dy}d`
  return new Date(d).toLocaleDateString()
}

export default function ItemCard({ item: initialItem, onClick, onDelete }) {
  const [item, setItem] = useState(initialItem)
  const isPending = item.status === 'pending_ai'
  const Icon = getContentTypeIcon(item.contentType, item.type)

  useEffect(() => {
    if (!isPending) return
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/items/${item._id}`)
        if (data.item.status !== 'pending_ai') {
          setItem(data.item)
          clearInterval(interval)
        }
      } catch {}
    }, 2500)
    return () => clearInterval(interval)
  }, [item._id, isPending])

  const domain = (() => {
    try { return new URL(item.url).hostname.replace('www.', '') } catch { return null }
  })()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid mb-3 isolate"
    >
      <AIGradientBorder active={isPending} className="rounded-lg" duration={2.2}>
        <div
          onClick={() => onClick(item)}
          className="group relative bg-white rounded-[inherit] overflow-hidden cursor-pointer"
          style={!isPending ? { border: '1px solid #E9E7E0' } : {}}
        >
          {/* type chip */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-line/60">
            <Icon className="text-[10px] text-muted" />
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted">{item.type}</span>
          </div>

          {isPending && (
            <span className="absolute top-2 right-2 z-10 font-mono text-[8px] uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              scanning
            </span>
          )}

          {/* thumbnail with hover reveal */}
          {(item.type === 'link' || item.type === 'image') && item.thumbnailUrl && (
            <div className="relative overflow-hidden">
              <img
                src={item.thumbnailUrl}
                alt=""
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                loading="lazy"
                onError={e => e.target.style.display = 'none'}
              />
              {/* youtube-style hover scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2.5">
                <span className="font-mono text-[9px] text-white/90 truncate max-w-[70%]">
                  {domain}
                </span>
                {item.url && (
                  <span className="w-6 h-6 rounded-full bg-white/95 flex items-center justify-center shrink-0">
                    <FiExternalLink className="text-[11px] text-ink" />
                  </span>
                )}
              </div>
              {/* center play/type icon on hover for video-like content */}
              {item.contentType === 'youtube' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="text-white text-[15px] ml-0.5" />
                  </span>
                </div>
              )}
            </div>
          )}

          {/* content */}
          <div className="px-2.5 pt-2 pb-1.5">
            {item.title && (
              <p className="font-serif text-[12.5px] leading-snug line-clamp-2 text-ink">{item.title}</p>
            )}
            {(item.type === 'note' || item.type === 'quote') && item.content && (
              <p className={`text-[12px] leading-relaxed text-ink line-clamp-3 mt-0.5 ${item.type === 'quote' ? 'font-serif italic' : ''}`}>
                {item.type === 'quote' ? `"${item.content}"` : item.content}
              </p>
            )}
          </div>

          {/* footer */}
          <div className="px-2.5 pb-2 flex items-center justify-between gap-1.5">
            <div className="flex flex-wrap gap-1 min-w-0">
              {item.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="font-mono text-[8px] text-muted border border-line px-1.5 py-0.5 rounded-full truncate max-w-[70px]">
                  {tag}
                </span>
              ))}
            </div>
            <span className="font-mono text-[8px] text-muted shrink-0">{timeAgo(item.createdAt)}</span>
          </div>

          {/* quick delete on hover */}
          {onDelete && !isPending && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item._id) }}
              className="absolute bottom-2 right-2 z-10 w-6 h-6 rounded-full bg-white border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-300 hover:text-red-500 text-muted"
            >
              <FiTrash2 className="text-[10px]" />
            </button>
          )}
        </div>
      </AIGradientBorder>
    </motion.div>
  )
}
