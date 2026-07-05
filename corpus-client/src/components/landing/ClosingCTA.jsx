export default function ClosingCTA() {
  return (
    <section className="border-t border-line">
      <div className="max-w-content mx-auto px-6 py-28 text-center">
        <h2 className="font-serif text-[36px] sm:text-[44px] leading-tight tracking-tightest max-w-xl mx-auto">
          Start keeping what you'd otherwise lose.
        </h2>
        <p className="mt-5 text-[15px] text-muted">
          Free while you're building your first hundred entries.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-8 bg-ink text-paper font-mono text-[13px] uppercase tracking-wide px-7 py-3.5 rounded-sm hover:bg-accent transition-colors"
        >
          Create your archive
        </a>
      </div>
    </section>
  )
}
