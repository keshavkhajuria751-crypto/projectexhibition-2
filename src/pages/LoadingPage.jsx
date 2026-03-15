import { useState, useEffect } from 'react'
import styles from './LoadingPage.module.css'

const STEPS = [
  { label: 'Fetching product data',           ms: 700  },
  { label: 'Loading 12-month price history',  ms: 600  },
  { label: 'Running regression model',        ms: 800  },
  { label: 'Calculating confidence score',    ms: 500  },
  { label: 'Generating recommendation',       ms: 400  },
]

export default function LoadingPage({ url }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    let elapsed = 0
    const ids = STEPS.map((s, i) => {
      elapsed += s.ms
      return setTimeout(() => setStep(i + 1), elapsed)
    })
    return () => ids.forEach(clearTimeout)
  }, [])

  const progress = Math.round((step / STEPS.length) * 100)

  return (
    <div className={styles.page}>
      <div className={`${styles.card} sci`}>

        {/* Dual spinner */}
        <div className={styles.spinnerWrap}>
          <div className={styles.spinnerOuter} />
          <div className={styles.spinnerInner} />
        </div>

        <h2 className={styles.title}>Analysing product</h2>
        <p className={styles.url} title={url}>{url}</p>

        {/* Step list */}
        <ol className={styles.steps}>
          {STEPS.map((s, i) => {
            const done   = i < step
            const active = i === step
            return (
              <li
                key={i}
                className={`${styles.step} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
              >
                <div className={styles.stepNum}>
                  {done ? '✓' : i + 1}
                </div>
                {s.label}
              </li>
            )
          })}
        </ol>

        {/* Progress bar */}
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
