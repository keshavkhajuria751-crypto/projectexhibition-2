export default function PriceChart({ history, predictedPrice, recommendation }) {
  const W = 700
  const H = 220
  const P = { l: 60, r: 80, t: 20, b: 38 }
  const iW = W - P.l - P.r
  const iH = H - P.t - P.b

  const allPrices = [...history.map(h => h.price), predictedPrice]
  const rawMin    = Math.min(...allPrices)
  const rawMax    = Math.max(...allPrices)
  const buffer    = (rawMax - rawMin) * 0.15
  const min       = rawMin - buffer
  const max       = rawMax + buffer

  const gx = (i) => P.l + (i / (history.length - 1)) * iW
  const gy = (v) => P.t + (1 - (v - min) / (max - min)) * iH

  const formatPrice = (v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`

  const linePath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'}${gx(i)},${gy(h.price)}`)
    .join(' ')
  const areaPath = `${linePath} L${gx(history.length - 1)},${P.t + iH} L${P.l},${P.t + iH} Z`

  const lastX  = gx(history.length - 1)
  const lastY  = gy(history[history.length - 1].price)
  const predX  = W - P.r + 44
  const predY  = gy(predictedPrice)
  const predColor = recommendation === 'BUY' ? '#2C6E49' : '#C94F2C'

  const yTicks = Array.from({ length: 5 }, (_, i) => min + ((max - min) / 4) * i)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#C94F2C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#C94F2C" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y labels */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={P.l} y1={gy(t)} x2={W - P.r} y2={gy(t)}
            stroke="#E5DDD0" strokeWidth="1"
            strokeDasharray={i === 0 ? '0' : '4,3'}
          />
          <text
            x={P.l - 8} y={gy(t) + 4}
            textAnchor="end" fill="#B8A99A"
            fontSize="10" fontFamily="DM Mono, monospace"
          >
            {formatPrice(Math.round(t))}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaFill)" />

      {/* Price line */}
      <path
        d={linePath} fill="none"
        stroke="#C94F2C" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Dots every 3 months */}
      {history.map((h, i) =>
        i % 3 === 0 && i < history.length - 1 ? (
          <circle
            key={i} cx={gx(i)} cy={gy(h.price)} r="3"
            fill="white" stroke="#C94F2C" strokeWidth="1.5"
          />
        ) : null
      )}

      {/* Current price — highlighted end dot */}
      <circle cx={lastX} cy={lastY} r="9" fill="rgba(201,79,44,0.12)" />
      <circle cx={lastX} cy={lastY} r="5" fill="white" stroke="#C94F2C" strokeWidth="2.5" />

      {/* Predicted dashed extension */}
      <line
        x1={lastX} y1={lastY} x2={predX} y2={predY}
        stroke={predColor} strokeWidth="2"
        strokeDasharray="6,4" opacity="0.8"
      />

      {/* Predicted dot */}
      <circle cx={predX} cy={predY} r="11" fill={predColor} opacity="0.15" />
      <circle cx={predX} cy={predY} r="6"  fill={predColor} />

      {/* Predicted label bubble */}
      <rect
        x={predX - 28} y={predY - 26}
        width={56} height={18} rx="6"
        fill={predColor} opacity="0.9"
      />
      <text
        x={predX} y={predY - 13}
        textAnchor="middle" fill="white"
        fontSize="10" fontFamily="DM Mono, monospace" fontWeight="500"
      >
        Predicted
      </text>

      {/* X-axis month labels */}
      {history.map((h, i) =>
        i % 2 === 0 ? (
          <text
            key={i} x={gx(i)} y={H - 5}
            textAnchor="middle" fill="#B8A99A"
            fontSize="10" fontFamily="DM Mono, monospace"
          >
            {h.month}
          </text>
        ) : null
      )}
      <text
        x={predX} y={H - 5}
        textAnchor="middle" fill={predColor}
        fontSize="10" fontFamily="DM Mono, monospace" fontWeight="500"
      >
        +30d
      </text>
    </svg>
  )
}
