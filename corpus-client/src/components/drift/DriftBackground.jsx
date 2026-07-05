export default function DriftBackground({ items }) {
  const bg = items.filter(i => i.thumbnailUrl).slice(0, 12)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />

      {/* scattered blurred thumbnails */}
      {bg.map((item, i) => {
        const positions = [
          'top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0',
          'top-1/4 left-0', 'top-1/4 right-0', 'bottom-1/4 left-0', 'bottom-1/4 right-0',
          'top-0 left-1/4', 'top-0 right-1/4', 'bottom-0 left-1/4', 'bottom-0 right-1/4',
        ]
        return (
          <div
            key={item._id + i}
            className={`absolute ${positions[i % positions.length]} w-52 h-52 overflow-hidden opacity-30`}
          >
            <img
              src={item.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover blur-sm scale-110"
            />
          </div>
        )
      })}

      {/* heavy overlay blur to make bg feel soft */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/40" />
    </div>
  )
}
