import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function NoCreditsModal({ isOpen, onClose }) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-md border border-line shadow-2xl w-full max-w-sm p-8 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✦</span>
            </div>
            <h2 className="font-serif text-[22px] mb-2">You've used all your saves</h2>
            <p className="text-[13.5px] text-muted leading-relaxed mb-6">
              Your 100 free saves are up. Upgrade to keep building your second memory.
            </p>
            <button
              onClick={() => { navigate('/pricing'); onClose() }}
              className="w-full bg-accent text-white font-mono text-[12px] uppercase tracking-wide py-3 rounded-sm hover:bg-accent/90 transition-colors mb-3"
            >
              View plans
            </button>
            <button
              onClick={onClose}
              className="w-full font-mono text-[11px] uppercase tracking-wide text-muted hover:text-ink transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
