
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export default function AIGradientBorder({ children, className, duration = 3, active = true }) {
  const turn = useMotionValue(0)

  useEffect(() => {
    if (!active) return
    const controls = animate(turn, 1, {
      ease: 'linear',
      duration,
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [duration, turn, active])

  const gradient = useMotionTemplate`conic-gradient(from ${turn}turn, transparent 0%, #f472b600 5%, #f472b6 10%, #c084fc 18%, #818cf8 26%, #38bdf8 34%, #2dd4bf 42%, #fbbf24 46%, #fbbf2400 52%, transparent 56%)`

  if (!active) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={twMerge('relative p-[1.5px]', className)}>
      <motion.div
        style={{ backgroundImage: gradient }}
        className="absolute inset-0 rounded-[inherit]"
      />
      <div className="relative rounded-[inherit] overflow-hidden">
        <div className="relative">{children}</div>
        <motion.div
          style={{ backgroundImage: gradient }}
          className="ai-glow-spill-mask opacity-60 blur-xl pointer-events-none absolute inset-[-40%] z-10"
        />
      </div>
    </div>
  )
}

