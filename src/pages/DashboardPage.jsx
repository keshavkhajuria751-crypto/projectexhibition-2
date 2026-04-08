import Topbar from '../components/Topbar'
import PriceChart from '../components/PriceChart'
import styles from './DashboardPage.module.css'
import { trackPrice } from '../utils/api'

const fmt  = (n) => '₹' + Number(n).toLocaleString('en-IN')
const fabs = (n) => '₹' + Math.abs(Number(n)).toLocaleString('en-IN')

export default function DashboardPage({ result: r, user, onNewAnalysis, onLogout }) {
  const isBuy  = r.recommendation === 'BUY'
  const pctAbs = Math.abs(parseFloat(r.pctChange))

  const handleTrack = async () => {
    try {
      await trackPrice({
        url: r.url,
        productName: r.name,
        currentPrice: r.currentPrice,
        targetPrice: r.predictedPrice
      });
      alert('Success! We will keep track of this price for you.');
    } catch (err) {
      console.error('Track failed:', err);
      alert('Failed to set up tracking. Please try again later.');
    }
  }

  return (
    <div className={styles.page}>
      <Topbar user={user} onNew={onNewAnalysis} onLogout={onLogout} />

      <div className={styles.body}>

        {/* Breadcrumb */}
        <nav className={`${styles.breadcrumb} fi`}>
          <span>Dashboard</span>
          <span className={styles.sep}>›</span>
          <span>{r.platform.name}</span>
          <span className={styles.sep}>›</span>
          <span>{r.category}</span>
        </nav>

        {/* ── Verdict banner ── */}
        <div className={`${styles.verdict} ${isBuy ? styles.verdictBuy : styles.verdictWait} fu`}>
          <div className={styles.verdictDecor}>{isBuy ? 'Buy' : 'Wait'}</div>

          <div className={`${styles.verdictTag} ${isBuy ? styles.tagBuy : styles.tagWait}`}>
            {isBuy ? '✓' : '⏳'} AI Recommendation · {r.confidence}% confidence
          </div>

          <h1 className={styles.verdictHeadline}>
            {isBuy ? '✓ Buy now' : '⏳ Wait for a better deal'}
          </h1>

          <p className={styles.verdictReason}>
            {isBuy
              ? `Price is predicted to rise ${pctAbs}% over the next 30 days — from ${fmt(r.currentPrice)} to ${fmt(r.predictedPrice)}. This is one of the lower price points of the last year. Act before prices go up.`
              : `Price is expected to drop ${pctAbs}% — from ${fmt(r.currentPrice)} to ${fmt(r.predictedPrice)}. You could save ${fabs(r.savings)} by waiting. Historically the lowest price was ${fmt(r.minH)} in ${r.bestM}.`
            }
          </p>

          <button 
            className={styles.trackBtn}
            onClick={() => handleTrack()}
          >
            🔔 Keep track of this price
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div className={styles.statsGrid}>
          {[
            {
              label: 'Current price',
              value: fmt(r.currentPrice),
              sub:   `${r.platform.name}`,
              color: 'var(--ink)',
              delay: '.10s',
            },
            {
              label: 'Predicted (30 days)',
              value: fmt(r.predictedPrice),
              badge: `${isBuy ? '▲' : '▼'} ${pctAbs}%`,
              badgeClass: isBuy ? styles.badgeUp : styles.badgeDown,
              color: isBuy ? 'var(--fg)' : 'var(--tc)',
              delay: '.18s',
            },
            {
              label: isBuy ? '12-month average' : 'Potential saving',
              value: isBuy ? fmt(r.avgH) : fabs(r.savings),
              sub:   isBuy ? 'Historical average price' : 'If you wait ~30 days',
              color: isBuy ? 'var(--ink-m)' : 'var(--fg)',
              delay: '.26s',
            },
            {
              label: 'Historical low',
              value: fmt(r.minH),
              sub:   `Lowest in 12 months · ${r.bestM}`,
              color: 'var(--fg)',
              delay: '.34s',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${styles.statCard} fu`}
              style={{ animationDelay: s.delay }}
            >
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
              {s.badge && (
                <span className={`${styles.badge} ${s.badgeClass}`}>{s.badge}</span>
              )}
              {s.sub && <div className={styles.statSub}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* ── Main grid: chart + sidebar ── */}
        <div className={styles.mainGrid}>

          {/* Chart */}
          <div className={`${styles.card} fu`} style={{ animationDelay: '.20s' }}>
            <div className="card-title">Price trend</div>
            <div className="card-sub">12-month history + 30-day AI prediction</div>
            <PriceChart
              history={r.history}
              predictedPrice={r.predictedPrice}
              recommendation={r.recommendation}
            />
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>

            {/* Confidence */}
            <div className={`${styles.card} fu`} style={{ animationDelay: '.28s' }}>
              <div className="card-title" style={{ fontSize: 17 }}>Model confidence</div>
              <div className="card-sub">Reliability scores</div>
              {[
                { label: 'Prediction accuracy', value: r.confidence, color: 'var(--tc)' },
                { label: 'Data completeness',   value: 89,           color: 'var(--fg)' },
                { label: 'Market stability',    value: 74,           color: 'var(--am)' },
              ].map((c) => (
                <div key={c.label} className={styles.confItem}>
                  <div className={styles.confHeader}>
                    <span className={styles.confName}>{c.label}</span>
                    <span className={styles.confPct} style={{ color: c.color }}>{c.value}%</span>
                  </div>
                  <div className={styles.confTrack}>
                    <div
                      className={styles.confBar}
                      style={{ width: `${c.value}%`, background: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className={`${styles.card} fu`} style={{ flex: 1, animationDelay: '.36s' }}>
              <div className="card-title" style={{ fontSize: 17, marginBottom: 16 }}>Quick insights</div>
              {[
                { icon: '📉', bg: 'var(--fg-l)',  title: 'Price range',  text: `${fmt(r.minH)} – ${fmt(r.maxH)}` },
                { icon: '📅', bg: 'var(--am-l)',  title: 'Best month',   text: `${r.bestM} historically had the lowest price` },
                { icon: '🏪', bg: 'var(--tc-l)',  title: 'Platform',     text: `${r.platform.icon} ${r.platform.name}` },
              ].map((ins) => (
                <div key={ins.title} className={styles.insightRow}>
                  <div className={styles.insightIcon} style={{ background: ins.bg }}>
                    {ins.icon}
                  </div>
                  <div>
                    <div className={styles.insightTitle}>{ins.title}</div>
                    <div className={styles.insightText}>{ins.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── URL strip ── */}
        <div className={`${styles.urlStrip} fu`} style={{ animationDelay: '.42s' }}>
          <div className={styles.urlIcon}>{r.platform.icon}</div>
          <div>
            <div className={styles.urlLabel}>ANALYSED URL</div>
            <div className={styles.urlText}>{r.url}</div>
          </div>
        </div>

      </div>
    </div>
  )
}
