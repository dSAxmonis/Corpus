import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function SpecimenCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[260px] bg-white border border-line rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] select-none"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-line/70">
        <span className="font-mono text-[10px] tracking-wider text-muted uppercase">No. 0412</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      </div>
      <div className="h-32 bg-gradient-to-br from-[#EFEDE6] to-[#E2E0D6] flex items-center justify-center">
        <svg viewBox="0 0 280 144" className="w-full h-full opacity-80">
          <polygon points="40,110 140,40 240,110 140,144" fill="#D8D5C8"/>
          <polygon points="40,110 140,40 140,144 70,144" fill="#CFCBBC"/>
          <circle cx="140" cy="40" r="3" fill="#2E5BFF"/>
        </svg>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="font-serif text-[14px] leading-snug">Notes on isometric grid construction</p>
        <p className="font-mono text-[10px] text-muted">saved from behance.net</p>
        <div className="flex gap-1.5 pt-0.5">
          {['design', 'reference'].map(t => (
            <span key={t} className="font-mono text-[10px] px-2 py-0.5 border border-line rounded-full text-muted">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const STEPS = [
  { mark: 'I', title: 'Save without deciding', body: 'Drop in a link, thought, or screenshot. No folder to choose, no tag to invent.' },
  { mark: 'II', title: 'It files itself', body: 'Each entry is indexed by meaning, so it surfaces again by association.' },
  { mark: 'III', title: 'You ask, it answers', body: 'Search the way you\'d describe it to a friend.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      {/* nav */}
      <header className="border-b border-line">
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg">Corpus</span>
            <span className="font-mono text-[10px] text-muted hidden sm:inline">/ secondary memory</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="font-mono text-[12px] uppercase text-muted hover:text-ink transition-colors hidden sm:inline">Sign in</Link>
            <Link to="/signup" className="font-mono text-[12px] uppercase bg-ink text-paper px-4 py-2 rounded-sm hover:bg-accent transition-colors">Start keeping</Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="max-w-content mx-auto px-6 pt-20 pb-28 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-[12px] uppercase tracking-wider text-accent mb-5">
            Est. for things worth keeping
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="font-serif text-[46px] sm:text-[54px] leading-[1.05] tracking-tightest">
            A second memory,<br/>kept in order.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 text-[17px] leading-relaxed text-muted max-w-md">
            Corpus holds the links, notes, and images you don't want to lose — organized by meaning, not folders.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-9 flex items-center gap-4">
            <Link to="/signup" className="bg-ink text-paper font-mono text-[13px] uppercase tracking-wide px-6 py-3.5 rounded-sm hover:bg-accent transition-colors">
              Start your archive
            </Link>
            <a href="#how" className="font-mono text-[13px] uppercase tracking-wide text-muted hover:text-ink transition-colors">
              See how it works
            </a>
          </motion.div>
        </div>
        <div className="flex justify-center md:justify-end">
          <SpecimenCard />
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-t border-line">
        <div className="max-w-content mx-auto px-6 py-24">
          <p className="font-mono text-[12px] uppercase tracking-wider text-accent mb-3">The process</p>
          <h2 className="font-serif text-[32px] leading-tight tracking-tightest max-w-md mb-14">
            Three steps, repeated for as long as you keep adding.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map(s => (
              <div key={s.mark} className="border-t border-line pt-6">
                <span className="font-serif text-[13px] text-accent">{s.mark}</span>
                <h3 className="font-serif text-[19px] mt-3 mb-2">{s.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="border-t border-line">
        <div className="max-w-content mx-auto px-6 py-28 text-center">
          <h2 className="font-serif text-[36px] leading-tight tracking-tightest max-w-xl mx-auto">
            Start keeping what you'd otherwise lose.
          </h2>
          <Link to="/signup" className="inline-block mt-8 bg-ink text-paper font-mono text-[13px] uppercase tracking-wide px-7 py-3.5 rounded-sm hover:bg-accent transition-colors">
            Create your archive
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-line">
        <div className="max-w-content mx-auto px-6 py-8 flex justify-between">
          <span className="font-mono text-[11px] text-muted">Corpus — secondary memory, 2026</span>
          <div className="flex gap-6 font-mono text-[11px] text-muted">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
