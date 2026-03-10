import { useState } from 'react'
import { QUIZ_STEPS } from '../data/quiz'
import { recommend } from '../utils/recommend'
import { theme } from '../styles/theme'
import { config } from '../data/config'

export default function FinderPage({ onAddToCart }) {
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)

  const select = (key, val) => {
    const next = { ...answers, [key]: val }
    setAnswers(next)
    if (step < QUIZ_STEPS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 280)
    } else {
      setTimeout(() => setResults(recommend(next)), 280)
    }
  }

  const reset = () => { setStep(0); setAnswers({}); setResults(null) }

  /* ── RESULTS ── */
  if (results) return (
    <div style={{ padding: '24px 16px', paddingBottom: 90 }}>
      <div className="serif fade-up" style={{ fontSize: 30, color: theme.gold, marginBottom: 4 }}>Your Matches</div>
      <div className="fade-up-2" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Based on your preferences</div>

      {results.map((p, i) => (
        <div
          key={p.id}
          className="fade-up"
          style={{
            animationDelay: `${i * 0.1}s`,
            background: theme.bgCard,
            border: `1px solid ${i === 0 ? theme.gold : theme.border}`,
            borderRadius: 18,
            padding: '18px',
            marginBottom: 14,
            display: 'flex', gap: 16, alignItems: 'center',
            position: 'relative',
          }}
        >
          {i === 0 && (
            <div style={{ position: 'absolute', top: -10, left: 18, background: theme.gold, color: theme.bgDark, fontSize: 9, fontWeight: 700, letterSpacing: 1, borderRadius: 99, padding: '3px 10px' }}>
              BEST MATCH
            </div>
          )}
          <div style={{ fontSize: 48, flexShrink: 0 }}>{p.emoji}</div>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 20, color: theme.white }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '3px 0 10px', textTransform: 'capitalize' }}>
              {p.family} · {p.intensity} · {p.size}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: theme.gold, fontWeight: 500, fontSize: 15 }}>
                {config.currency} {p.price.toLocaleString()}
              </span>
              <button
                className="btn-gold"
                style={{ padding: '7px 16px', fontSize: 12 }}
                onClick={() => onAddToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}

      <button className="btn-outline" style={{ width: '100%', padding: '13px', fontSize: 13, marginTop: 8 }} onClick={reset}>
        ← Retake Quiz
      </button>
    </div>
  )

  /* ── QUIZ ── */
  const current  = QUIZ_STEPS[step]
  const progress = ((step) / QUIZ_STEPS.length) * 100

  return (
    <div style={{ padding: '32px 20px', paddingBottom: 90, minHeight: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>

      {/* Progress bar */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
          <span>Step {step + 1} of {QUIZ_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldDark})`, borderRadius: 99, transition: 'width .4s ease' }} />
        </div>
      </div>

      {/* Step icon + question */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{current.icon}</div>
        <div className="serif fade-up" style={{ fontSize: 26, color: theme.white, lineHeight: 1.3 }}>
          {current.label}
        </div>
      </div>

      {/* Options grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {current.options.map(opt => (
          <button
            key={opt}
            className={`quiz-opt ${answers[current.key] === opt ? 'selected' : ''}`}
            onClick={() => select(current.key, opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Back button */}
      {step > 0 && (
        <button
          className="btn-outline"
          style={{ marginTop: 'auto', padding: '12px', fontSize: 13, marginTop: 32 }}
          onClick={() => setStep(s => s - 1)}
        >
          ← Back
        </button>
      )}
    </div>
  )
}
