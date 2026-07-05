import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DriftCard from '../../components/drift/DriftCard.jsx'
import DriftBackground from '../../components/drift/DriftBackground.jsx'
import DriftDone from '../../components/drift/DriftDone.jsx'
import DetailPanel from '../../components/dashboard/DetailPanel.jsx'
import { fetchDriftItems, deleteItem, updateItem } from '../../api/items.js'

export default function DriftPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const [kept, setKept] = useState(0)
  const [forgotten, setForgotten] = useState(0)
  const [direction, setDirection] = useState('right')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [exiting, setExiting] = useState(false)

  async function loadItems() {
    setLoading(true)
    setDone(false)
    setIndex(0)
    setKept(0)
    setForgotten(0)
    try {
      const data = await fetchDriftItems(20)
      if (!data.items.length) {
        setEmpty(true)
      } else {
        setItems(data.items)
        setEmpty(false)
      }
    } catch {
      setEmpty(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  const current = items[index]

  function next(dir) {
    setDirection(dir)
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      if (index + 1 >= items.length) {
        setDone(true)
      } else {
        setIndex(i => i + 1)
      }
    }, 280)
  }

  const handleKeep = useCallback(() => {
    if (exiting || !current) return
    setKept(k => k + 1)
    next('right')
  }, [exiting, current, index, items.length])

  const handleForget = useCallback(() => {
    if (exiting || !current) return
    setForgotten(f => f + 1)
    deleteItem(current._id).catch(() => {})
    // optimistically update local list
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, _forgotten: true } : item
    ))
    next('left')
  }, [exiting, current, index, items.length])

  // keyboard support
  useEffect(() => {
    function handle(e) {
      if (selectedItem) return // don't intercept when detail panel is open
      if (e.key === 'ArrowRight') handleKeep()
      if (e.key === 'ArrowLeft') handleForget()
      if (e.key === 'Escape') navigate('/dashboard')
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [handleKeep, handleForget, selectedItem, navigate])

  // touch/swipe support
  useEffect(() => {
    let startX = 0
    function onStart(e) { startX = e.touches[0].clientX }
    function onEnd(e) {
      if (selectedItem) return
      const diff = e.changedTouches[0].clientX - startX
      if (diff > 60) handleKeep()
      else if (diff < -60) handleForget()
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [handleKeep, handleForget, selectedItem])

  const progress = items.length ? ((index) / items.length) * 100 : 0

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: 'inherit' }}>
      {/* blurred background */}
      <DriftBackground items={items} />

      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-5" style={{pointerEvents: 'all'}}>
        <button
          onClick={() => { try { navigate('/dashboard') } catch { window.location.href = '/dashboard' } }}
          className="font-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white transition-colors"
          style={{ cursor: 'pointer' }}
        >
          ← Exit
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
            Drift
          </span>
          <span className="font-mono text-[11px] text-white/30">
            {!done && items.length ? `${index + 1} / ${items.length}` : ''}
          </span>
        </div>

        <div className="w-20" />
      </div>

      {/* progress bar */}
      {!done && !loading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 z-40">
          <motion.div
            className="h-full bg-white/30"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* main content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="font-mono text-[12px] uppercase tracking-wider text-white/50"
            >
              Loading your archive…
            </motion.div>
          </div>
        ) : empty ? (
          <div className="text-center px-6">
            <p className="font-serif text-[24px] text-white mb-3">Nothing to drift through yet.</p>
            <p className="text-[14px] text-white/40 mb-6">Save some links, notes, or images first.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="font-mono text-[12px] uppercase tracking-wide text-white border border-white/20 px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Go to archive
            </button>
          </div>
        ) : done ? (
          <DriftDone kept={kept} forgotten={forgotten} onPlayAgain={loadItems} />
        ) : (
          <AnimatePresence mode="wait">
            {!exiting && current && (
              <DriftCard
                key={current._id}
                item={current}
                direction={direction}
                onKeep={handleKeep}
                onForget={handleForget}
                onClick={() => setSelectedItem(current)}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* detail panel — opens over drift, closes back to same card */}
      {selectedItem && (
        <DetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={(id) => {
            setSelectedItem(null)
            setForgotten(f => f + 1)
            setItems(prev => prev.filter(i => i._id !== id))
            if (index >= items.length - 1) setDone(true)
          }}
          onUpdate={() => {
            // item was updated in detail panel - nothing to refresh locally
          }}
        />
      )}
    </div>
  )
}
