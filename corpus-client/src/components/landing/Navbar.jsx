export default function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg tracking-tight">Corpus</span>
          <span className="font-mono text-[10px] text-muted hidden sm:inline">
            / secondary memory
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-[12px] uppercase tracking-wide text-muted">
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#archive" className="hover:text-ink transition-colors">The archive</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="font-mono text-[12px] uppercase tracking-wide text-muted hover:text-ink transition-colors hidden sm:inline"
          >
            Sign in
          </a>
          <a
            href="/dashboard"
            className="font-mono text-[12px] uppercase tracking-wide bg-ink text-paper px-4 py-2 rounded-sm hover:bg-accent transition-colors"
          >
            Start keeping
          </a>
        </div>
      </div>
    </header>
  )
}
