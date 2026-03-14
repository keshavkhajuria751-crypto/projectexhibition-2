import { useState } from 'react'
import Topbar from '../components/Topbar'
import { PLATFORM_LIST, matchPlatform } from '../utils/mlEngine'
import styles from './LinkPage.module.css'

const EXAMPLE_URLS = [
  'https://www.amazon.in/Sony-WH-1000XM5-Wireless-Headphones/dp/B09XS7JWHH',
  'https://www.flipkart.com/samsung-galaxy-s24-5g/p/itmdb3b3c2f1d9f7',
  'https://www.myntra.com/shoes/nike/air-max-270/12345678/buy',
]

export default function LinkPage({ user, onAnalyze, onLogout }) {
  const [url, setUrl] = useState('')
  const [err, setErr] = useState('')

  const detected = matchPlatform(url)

  const handleAnalyze = () => {
    setErr('')
    if (!url.trim())              return setErr('Please paste a product URL.')
    if (!url.startsWith('http'))  return setErr('URL must start with http:// or https://')
    if (!matchPlatform(url))      return setErr('We support Amazon (amzn.in too), Flipkart, Myntra, Meesho, Croma, and Nykaa links.')
    onAnalyze(url)
  }

  return (
    <div className={styles.page}>
      <Topbar user={user} onNew={() => {}} onLogout={onLogout} showNew={false} />

      <main className={styles.main}>
        <div className={styles.inner}>

          {/* Eyebrow */}
          <div className={`${styles.eyebrow} fu`}>
            <span className={styles.eyebrowDot} />
            ML Price Engine · Ready
          </div>

          {/* Headline */}
          <h1 className={`${styles.title} fu d1`}>
            Paste a product link.<br />
            We'll tell you <em className={styles.titleEm}>when to buy.</em>
          </h1>

          <p className={`${styles.sub} fu d2`}>
            Our regression model analyses 12 months of price history to predict whether
            prices will rise or fall — so you never overpay again.
          </p>

          {/* Input */}
          <div className={`fu d3`}>
            {err && <div className="error-msg">⚠ {err}</div>}

            <div
              className={styles.inputBox}
              style={{ borderColor: detected ? detected.color : undefined }}
            >
              <span className={styles.inputIcon}>
                {detected ? detected.icon : '🔗'}
              </span>
              <input
                className={styles.urlInput}
                placeholder="Paste product URL — amazon.in, amzn.in, flipkart.com…"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setErr('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              {detected && (
                <span className={styles.detectedLabel} style={{ color: detected.color }}>
                  {detected.name}
                </span>
              )}
              <button className={styles.analyzeBtn} onClick={handleAnalyze}>
                Analyse →
              </button>
            </div>

            {/* Example chips */}
            <div className={styles.examples}>
              <span className={styles.examplesLabel}>Try:</span>
              {EXAMPLE_URLS.map((e, i) => (
                <span
                  key={i}
                  className={styles.exampleChip}
                  onClick={() => setUrl(e)}
                  title={e}
                >
                  {e.replace('https://www.', '').substring(0, 28)}…
                </span>
              ))}
            </div>
          </div>

          {/* Platform grid */}
          <div className={`fu d4`}>
            <div className={styles.sectionLabel}>Supported platforms</div>
            <div className={styles.platformGrid}>
              {PLATFORM_LIST.map((p) => {
                const isActive = p.domains.some(d => url.toLowerCase().includes(d))
                return (
                  <div
                    key={p.name}
                    className={styles.platformCard}
                    style={{ borderColor: isActive ? p.color : undefined }}
                  >
                    <div className={styles.platformIcon}>{p.icon}</div>
                    <div
                      className={styles.platformName}
                      style={{ color: isActive ? p.color : undefined }}
                    >
                      {p.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
