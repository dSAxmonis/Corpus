import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function DriftDone({ kept, forgotten, onPlayAgain }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center px-6 gap-6"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-5xl"
      >
        ✦
      </motion.div>

      <h2 className="font-serif text-[32px] text-white leading-tight">
        Your mind is cleaner now.
      </h2>

      <div className="flex gap-10">
        <div className="text-center">
          <p className="font-serif text-[40px] text-white leading-none">{kept}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/40 mt-1">Kept</p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="font-serif text-[40px] text-white/60 leading-none">{forgotten}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/40 mt-1">Forgotten</p>
        </div>
      </div>

      <p className="text-[14px] text-white/40 max-w-xs font-serif italic leading-relaxed">
        You went on a visual journey through your memory and kept what still matters.
      </p>

      <div className="flex gap-4 mt-2">
        <button
          onClick={onPlayAgain}
          className="font-mono text-[12px] uppercase tracking-wide text-white border border-white/20 px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors"
        >
          One more round
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="font-mono text-[12px] uppercase tracking-wide text-white/50 hover:text-white transition-colors px-4"
        >
          Back to archive
        </button>
      </div>
    </motion.div>
  )
}
