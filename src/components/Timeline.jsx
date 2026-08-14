import React, { useMemo, useState, useEffect, useRef } from 'react'
import LadderGame from './LadderGame'

const schedule = [
  { time: '14:30', title: '간단 식사', subtitle: '🔒 9월 16일 공개 예정', locked: true },
  {
    time: '16:30',
    title: '약속 일정',
    subtitle: '백화점에서 선물 고르기',
    button: '🎁 이벤트 고르기',
    event: true,
  },
  { time: '17:30', title: '다음 일정', subtitle: '🔒 9월 16일 공개 예정', locked: true },
  { time: '19:30', title: '저녁 식사', subtitle: '🔒 9월 16일 공개 예정', locked: true },
]

const ladderChoices = ['1', '2', '3']
const fixedPrize = '백화점에서 선물 고르기'

function buildLadderPath(startIndex) {
  // dynamic zig-zag path generator for a lively ladder route
  const cols = [46, 140, 234]
  const rows = [18, 42, 66, 90, 114, 138, 162]
  const points = rows.map((y, i) => {
    // oscillate across columns to create left-right movement
    const phase = (startIndex + i) % 3
    const baseX = cols[phase]
    // small horizontal jitter to avoid perfectly straight segments
    const jitter = (i % 2 === 0) ? -8 : 8
    return [baseX + jitter, y]
  })
  // final landing point in the middle area
  points.push([140, 188])
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export default function Timeline({ onNext }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [resultOpen, setResultOpen] = useState(false)
  const [showLadderReveal, setShowLadderReveal] = useState(false)
  const [revealAll, setRevealAll] = useState(false)
  const [ladderDone, setLadderDone] = useState(false)
  const animRef = useRef(null)

  const ladderColumns = useMemo(
    () => Array.from({ length: 3 }, (_, idx) => ({ id: idx, label: idx + 1 })),
    []
  )

  function openLadderModal() {
    setSelectedChoice('')
    setResultOpen(false)
    setShowLadderReveal(false)
    setModalOpen(true)
  }

  function handleChoice(choiceIndex) {
    setSelectedChoice(choiceIndex)
    setShowLadderReveal(true)
    // animation length for stroke drawing
    const duration = 1400
    if (animRef.current) clearTimeout(animRef.current)
    animRef.current = setTimeout(() => {
      // reveal all prizes when the stroke reaches bottom
      setRevealAll(true)
      // show final result modal shortly after
      setTimeout(() => setResultOpen(true), 200)
      // close ladder modal after brief pause
      setTimeout(() => setModalOpen(false), 900)
    }, duration)
  }

  useEffect(() => {
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [])

  // load persisted ladder completion state
  useEffect(() => {
    try {
      const done = localStorage.getItem('ladderEventDone') === 'true'
      if (done) setLadderDone(true)
    } catch (e) {
      // ignore localStorage errors (private mode)
    }
  }, [])

  return (
    <div className="screen schedule-page">
      <div className="container timeline-container">
        <header className="schedule-header">
          <div className="schedule-kicker">9월 17일 SCHEDULE</div>
          <div className="schedule-subtitle">동신오빠 생일 축하해</div>
        </header>

        <div className="timeline-list">
          {schedule.map((item, index) => (
            <div className="timeline-item" key={`${item.time}-${index}`}>
              <div className="timeline-marker-wrap">
                <span className="timeline-marker" />
                <span className="timeline-line" />
              </div>

              <div className="timeline-card">
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-content">
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-subtitle">
                    {item.event ? (ladderDone ? `${fixedPrize} 🛍️` : '') : item.subtitle}
                  </div>

                  {item.event && (
                    !ladderDone ? (
                      <button type="button" className="timeline-btn" onClick={openLadderModal}>
                        {item.button}
                      </button>
                    ) : (
                      <button type="button" className="timeline-btn completed" disabled>✅ 선택 완료</button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="timeline-footer">
          <button className="btn timeline-next" onClick={onNext}>NEXT</button>
        </div>
      </div>

      {modalOpen && (
        <div className="ladder-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="ladder-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ladder-header">
              <div className="ladder-label">이벤트 고르기</div>
              <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>
                ×
              </button>
            </div>

            <div className="ladder-area" aria-label="Rigged ladder">
              <LadderGame fixedPrize={fixedPrize} onReveal={() => {
                // when ladder finishes, persist and update UI
                localStorage.setItem('ladderEventDone', 'true')
                setLadderDone(true)
                setRevealAll(true)
                setTimeout(() => setResultOpen(true), 200)
                setTimeout(() => setModalOpen(false), 900)
              }} />
              <div className="ladder-result-tag">{revealAll ? `당첨! ${fixedPrize}` : '선택지를 골라 사다리를 내려보세요'}</div>
            </div>
          </div>
        </div>
      )}

      {resultOpen && (
        <div className="result-modal-backdrop" onClick={() => setResultOpen(false)}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = i * 15
                const x = ((i % 4) - 1.5) * 26
                const y = 110 + (i % 6) * 8
                return <span key={i} style={{ '--angle': `${angle}deg`, '--x': `${x}px`, '--y': `${y}px` }} />
              })}
            </div>
            <div className="result-title">축하합니다!</div>
            <div className="result-text">[{fixedPrize}] 당첨!</div>
            <button type="button" className="result-close" onClick={() => setResultOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
