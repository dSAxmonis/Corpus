import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function SpaceCard({ space }) {
  const navigate = useNavigate()
  const previews = space.previewItems || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/spaces/${space._id}`)}
      className="cursor-pointer flex flex-col items-center w-44"
    >
      <div className="relative w-32 h-32 flex items-center justify-center mb-3">
        {previews.length === 0 ? (
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: space.color + '55', backgroundColor: space.color + '14' }}
          >
            <span className="font-serif italic text-[12px] text-center px-3 leading-tight" style={{ color: space.color }}>
              Empty<br/>Space
            </span>
          </div>
        ) : (
          <>
            {previews[1] && (
              <div className="absolute w-20 h-26 rounded-sm bg-white border border-line shadow-sm transform -rotate-6 translate-x-3 overflow-hidden">
                {previews[1].thumbnailUrl
                  ? <img src={previews[1].thumbnailUrl} className="w-full h-full object-cover" alt=""/>
                  : <div className="w-full h-full" style={{ backgroundColor: space.color + '22' }} />}
              </div>
            )}
            {previews[0] && (
              <div className="absolute w-20 h-26 rounded-sm bg-white border border-line shadow-md transform rotate-3 -translate-x-2 overflow-hidden z-10">
                {previews[0].thumbnailUrl
                  ? <img src={previews[0].thumbnailUrl} className="w-full h-full object-cover" alt=""/>
                  : <div className="w-full h-full flex items-center justify-center p-2" style={{ backgroundColor: space.color + '18' }}>
                      <span className="font-serif text-[10px] text-center line-clamp-3" style={{ color: space.color }}>
                        {previews[0].title}
                      </span>
                    </div>}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: space.color }} />
        <span className="font-serif text-[15px] text-ink">{space.name}</span>
      </div>
      {space.itemCount > 0 && (
        <span className="font-mono text-[10px] text-muted mt-0.5">{space.itemCount} item{space.itemCount !== 1 ? 's' : ''}</span>
      )}
    </motion.div>
  )
}
