import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ColorPicker from './ColorPicker.jsx'

export default function CreateSpaceModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#2E5BFF')
  const [saving, setSaving] = useState(false)

  function handleClose() {
    setName('')
    setColor('#2E5BFF')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onCreate({ name: name.trim(), color })
      handleClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={handleClose}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            onSubmit={handleSubmit}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-md border border-line shadow-2xl w-full max-w-sm p-7"
          >
            <h2 className="font-serif text-[24px] text-center mb-1">Pick a color</h2>
            <p className="text-[13px] text-muted text-center mb-6">
              Color coding your space helps you spot it easier.
            </p>

            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Space name…"
              className="w-full border border-line rounded-sm px-3.5 py-2.5 text-[14px] mb-6 text-center font-serif focus:outline-none focus:border-ink/40"
            />

            <ColorPicker value={color} onChange={setColor} />

            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="w-full mt-7 font-mono text-[12px] uppercase tracking-wide text-white py-3 rounded-full transition-opacity disabled:opacity-40"
              style={{ backgroundColor: color }}
            >
              {saving ? 'Creating…' : 'Finish & Save'}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
