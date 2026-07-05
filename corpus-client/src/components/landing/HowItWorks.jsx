const STEPS = [
  {
    mark: 'I',
    title: 'Save without deciding',
    body: 'Drop in a link, a thought, a screenshot. No folder to choose, no tag to invent. Corpus takes it as it is.',
  },
  {
    mark: 'II',
    title: 'It files itself',
    body: 'Each entry is read and quietly indexed by what it actually means — so it can surface again by association, not just by name.',
  },
  {
    mark: 'III',
    title: 'You ask, it answers',
    body: 'Search the way you\u2019d describe something to a friend. Corpus finds the entry even if you forgot the exact words.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line">
      <div className="max-w-content mx-auto px-6 py-24">
        <div className="max-w-md mb-16">
          <p className="font-mono text-[12px] uppercase tracking-wider text-accent mb-3">
            The process
          </p>
          <h2 className="font-serif text-[32px] leading-tight tracking-tightest">
            Three steps, repeated for as long as you keep adding.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {STEPS.map((step) => (
            <div key={step.mark} className="border-t border-line pt-6">
              <span className="font-serif text-[13px] text-accent">{step.mark}</span>
              <h3 className="font-serif text-[19px] mt-3 mb-2 text-ink">
                {step.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
