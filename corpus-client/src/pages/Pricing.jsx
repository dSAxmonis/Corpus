import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PLANS = [
  {
    name: 'Beginner',
    price: '₹199',
    period: '/month',
    credits: '500 saves',
    color: '#6D28D9',
    features: [
      '500 saves per month',
      'AI tagging + TLDR',
      'All save types (link, note, quote, image)',
      'Semantic search',
      'Up to 3 Spaces',
    ],
    cta: 'Get Beginner',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    credits: '2,000 saves',
    color: '#2E5BFF',
    features: [
      '2,000 saves per month',
      'AI tagging + TLDR',
      'All save types + browser extension',
      'Semantic search',
      'Unlimited Spaces',
      'Priority AI processing',
    ],
    cta: 'Get Pro',
    highlight: true,
  },
  {
    name: 'Max',
    price: '₹999',
    period: '/month',
    credits: 'Unlimited saves',
    color: '#171717',
    features: [
      'Unlimited saves',
      'AI tagging + TLDR',
      'All save types + browser extension',
      'Semantic search',
      'Unlimited Spaces',
      'Priority AI processing',
      'Export archive (JSON/CSV)',
      'Early access to new features',
    ],
    cta: 'Get Max',
    highlight: false,
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-content mx-auto px-6 py-16">

        <div className="flex items-center gap-3 mb-14">
          <button
            onClick={() => navigate(-1)}
            className="font-mono text-[12px] text-muted hover:text-ink transition-colors"
          >
            ← back
          </button>
        </div>

        <div className="text-center mb-14">
          <p className="font-mono text-[12px] uppercase tracking-wider text-accent mb-3">Plans</p>
          <h1 className="font-serif text-[40px] leading-tight tracking-tightest mb-4">
            Keep your memory growing.
          </h1>
          <p className="text-[16px] text-muted max-w-md mx-auto">
            Your first 100 saves are free. When you're ready to go further, pick a plan that fits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-sm border flex flex-col ${
                plan.highlight
                  ? 'border-accent bg-white shadow-lg shadow-accent/10'
                  : 'border-line bg-white'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white bg-accent px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="p-7 border-b border-line">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: plan.color }} />
                  <span className="font-mono text-[12px] uppercase tracking-wider text-ink">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-serif text-[38px] leading-none">{plan.price}</span>
                  <span className="font-mono text-[12px] text-muted">{plan.period}</span>
                </div>
                <p className="font-mono text-[11px] text-muted">{plan.credits}</p>
              </div>

              <div className="p-7 flex-1">
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                      <span className="font-mono text-accent mt-0.5 shrink-0">✓</span>
                      <span className="text-ink leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-7 pt-0">
                <button
                  onClick={() => alert('Razorpay integration coming soon!')}
                  className="w-full font-mono text-[12px] uppercase tracking-wide py-3 rounded-sm transition-colors"
                  style={
                    plan.highlight
                      ? { background: plan.color, color: '#fff' }
                      : { border: `1px solid ${plan.color}`, color: plan.color }
                  }
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-mono text-[11px] text-muted">
            All plans include a 7-day free trial. Cancel anytime. Razorpay payment coming soon.
          </p>
        </div>

      </div>
    </div>
  )
}
