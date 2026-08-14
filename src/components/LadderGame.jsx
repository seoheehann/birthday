import React, { useRef, useState, useEffect } from 'react'

const railsX = [46, 140, 234]
const topY = 16
const bottomY = 172

// Predefined diagonal connectors (fromRail -> toRail with fromY/toY)
const connectors = [
  { from: 0, to: 1, fromY: 44, toY: 64 },
  { from: 1, to: 2, fromY: 74, toY: 94 },
  { from: 2, to: 1, fromY: 104, toY: 124 },
  { from: 1, to: 0, fromY: 134, toY: 154 },
  { from: 0, to: 1, fromY: 160, toY: 170 },
  { from: 1, to: 2, fromY: 50, toY: 70 },
  { from: 2, to: 1, fromY: 120, toY: 140 },
]

function simulatePath(startRail) {
  const sorted = [...connectors].sort((a, b) => Math.min(a.fromY, a.toY) - Math.min(b.fromY, b.toY))
  let currentRail = startRail
  let y = topY
  const points = []
  points.push([railsX[currentRail], y])

  for (let i = 0; i < sorted.length; i++) {
    const c = sorted[i]
    // connector only usable if it starts on current rail (from) and is below current y
    if (c.from === currentRail && c.fromY > y + 2) {
      // go down to connector start
      points.push([railsX[currentRail], c.fromY])
      // move along diagonal to target rail
      points.push([railsX[c.to], c.toY])
      currentRail = c.to
      y = c.toY
    }
  }

  // final descent to bottom
  points.push([railsX[currentRail], bottomY])
  return points
}

function pointsToPath(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export default function LadderGame({ fixedPrize = '백화점에서 선물 고르기', onReveal }) {
  const [selected, setSelected] = useState(null)
  const [pathD, setPathD] = useState('')
  const [animating, setAnimating] = useState(false)
  const pathRef = useRef(null)

  useEffect(() => {
    let to = null
    if (animating && pathRef.current) {
      const path = pathRef.current
      const len = path.getTotalLength()
      path.style.strokeDasharray = len
      path.style.strokeDashoffset = len
      // animation duration scaled to path length
      const duration = Math.max(900, Math.min(2200, Math.round(len * 2)))
      path.style.transition = `stroke-dashoffset ${duration}ms linear, opacity ${Math.floor(duration / 3)}ms ease`;
      // start the animation next frame
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0' })

      to = setTimeout(() => {
        setAnimating(false)
        if (onReveal) onReveal()
      }, duration + 60)
    }
    return () => { if (to) clearTimeout(to) }
  }, [animating, pathD, onReveal])

  function handlePick(index) {
    if (animating) return
    setSelected(index)
    const pts = simulatePath(index)
    setPathD(pointsToPath(pts))
    // animate after path is set/rendered
    setTimeout(() => setAnimating(true), 60)
  }

  return (
    <div className="ladder-area-inner">
      <div className="choice-row top">
        {[1,2,3].map((n, i) => (
          <button key={n} type="button" className={`choice-btn ${selected === i ? 'selected' : ''}`} onClick={() => handlePick(i)}>
            {n}
          </button>
        ))}
      </div>

      <svg className="ladder-svg" viewBox="0 0 280 210" role="img" aria-label="사다리">
        <g className="ladder-frame">
          {railsX.map((x, i) => (
            <line key={`rail-${i}`} x1={x} y1={topY} x2={x} y2={bottomY} className="ladder-rail" />
          ))}

          {/* diagonal connectors (visual hints) */}
          {connectors.map((c, idx) => (
            <line key={`conn-${idx}`} x1={railsX[c.from]} y1={c.fromY} x2={railsX[c.to]} y2={c.toY} className="ladder-connector" />
          ))}

          {/* animated path */}
          {pathD && (
            <path ref={pathRef} d={pathD} className={`ladder-path ${animating ? 'active' : 'revealed'}`} />
          )}
        </g>
      </svg>

      <div className="ladder-bottom-labels">
        {[0,1,2].map((i) => (
          <div key={i} className={`ladder-bottom-label ${selected === null ? '' : 'waiting'}`}>
            <div className={`cover-emoji`}>🎁</div>
            <div className={`prize-text`}>{fixedPrize}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
