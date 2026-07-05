import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpacePicker from '../spaces/SpacePicker.jsx'

const TYPES = [
  { value: 'link', label: 'Link' },
  { value: 'note', label: 'Note' },
  { value: 'quote', label: 'Quote' },
  { value: 'image', label: 'Image' },
]

export default function SaveComposer({ isOpen, onClose, onSave, isSaving }) {
  const [type, setType] = useState('link')
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [spaceId, setSpaceId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function reset() {
    setType('link'); setUrl(''); setContent(''); setTitle(''); setSpaceId(null)
    setImageFile(null); setImagePreview(null); setError('')
  }
  function handleClose() { reset(); onClose() }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (type === 'link' && !url.trim()) return setError('Paste a URL.')
    if ((type === 'note' || type === 'quote') && !content.trim()) return setError('Write something.')
    if (type === 'image' && !imageFile) return setError('Choose an image.')
    try {
      await onSave({ type, url, content, title, imageFile, spaceId })
      reset()
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink/30 z-50 flex items-start justify-center pt-[10vh] px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-line rounded-sm w-full max-w-lg shadow-lg"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">New entry</span>
              <button onClick={handleClose} className="font-mono text-[11px] text-muted hover:text-ink">esc</button>
            </div>

            <div className="flex items-center justify-between px-5 pt-4">
              <div className="flex gap-1">
                {TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => setType(t.value)}
                    className={`font-mono text-[11px] uppercase px-3 py-1.5 rounded-full border transition-colors ${type === t.value ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:text-ink'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <SpacePicker value={spaceId} onChange={setSpaceId} />
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5">
              {type === 'link' && (
                <input type="url" autoFocus value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full border border-line rounded-sm px-3.5 py-2.5 text-[14px] font-mono focus:outline-none focus:border-ink/40"/>
              )}
              {(type === 'note' || type === 'quote') && (
                <textarea autoFocus value={content} onChange={e => setContent(e.target.value)}
                  placeholder={type === 'note' ? 'Write your note…' : 'Paste a quote…'} rows={5}
                  className="w-full border border-line rounded-sm px-3.5 py-2.5 text-[14.5px] font-serif resize-none focus:outline-none focus:border-ink/40"/>
              )}
              {type === 'image' && (
                <div>
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-sm border border-line"/>
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
                        className="absolute top-2 right-2 bg-white/90 font-mono text-[10px] px-2 py-1 rounded-sm border border-line">change</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-full h-48 border border-dashed border-line rounded-sm flex items-center justify-center hover:border-ink/40 transition-colors">
                      <span className="font-mono text-[12px] text-muted">click to choose an image</span>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
                </div>
              )}
              {(type === 'image' || type === 'note') && (
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="w-full mt-3 border border-line rounded-sm px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-ink/40"/>
              )}
              {error && <p className="text-[12.5px] text-red-600 mt-3">{error}</p>}
              <div className="flex justify-end gap-3 mt-5">
                <button type="button" onClick={handleClose} className="font-mono text-[12px] uppercase text-muted hover:text-ink px-2">Cancel</button>
                <button type="submit" disabled={isSaving}
                  className="bg-ink text-paper font-mono text-[12px] uppercase tracking-wide px-5 py-2.5 rounded-sm hover:bg-accent transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
