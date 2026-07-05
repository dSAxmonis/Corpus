import { motion } from 'framer-motion'
import SpecimenCard from './SpecimenCard.jsx'

export default function Hero() {
  return (
    <section className="max-w-content mx-auto px-6 pt-20 pb-28 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[12px] uppercase tracking-wider text-accent mb-5"
        >
          Est. for things worth keeping
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-[44px] sm:text-[56px] leading-[1.05] tracking-tightest text-ink"
        >
          A second memory,
          <br />
          kept in order.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 text-[17px] leading-relaxed text-muted max-w-md"
        >
          Corpus holds the links, notes, and images you don't want to lose —
          and quietly organizes them by what they mean, not where you put them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-9 flex items-center gap-4"
        >
          <a
            href="/dashboard"
            className="bg-ink text-paper font-mono text-[13px] uppercase tracking-wide px-6 py-3.5 rounded-sm hover:bg-accent transition-colors"
          >
            Start your archive
          </a>
          <a
            href="#how"
            className="font-mono text-[13px] uppercase tracking-wide text-muted hover:text-ink transition-colors border-b border-transparent hover:border-ink"
          >
            See how it works
          </a>
        </motion.div>
      </div>

      <div className="flex justify-center md:justify-end">
        <SpecimenCard />
      </div>
    </section>
  )
}
