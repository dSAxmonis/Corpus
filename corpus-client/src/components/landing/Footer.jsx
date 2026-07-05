export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-content mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-muted">
          Corpus — secondary memory, 2026
        </span>
        <div className="flex items-center gap-6 font-mono text-[11px] text-muted">
          <a href="#" className="hover:text-ink transition-colors">Privacy</a>
          <a href="#" className="hover:text-ink transition-colors">Terms</a>
          <a href="#" className="hover:text-ink transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
