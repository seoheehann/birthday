import React, { useEffect, useRef, useState } from 'react'
import { ALLOW_QUIZ_RETRY, getDailyQuiz, rouletteItems } from '../data/rouletteData'
import { getLocalDateKey } from '../utils/rouletteStorage'

function pickWeightedItem() {
  const total = rouletteItems.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * total
  for (let index = 0; index < rouletteItems.length; index += 1) {
    random -= rouletteItems[index].weight
    if (random < 0) return index
  }
  return rouletteItems.length - 1
}

function polarPoint(center, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180
  return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) }
}

function createSectorPath(startAngle, endAngle) {
  const start = polarPoint(150, 140, startAngle)
  const end = polarPoint(150, 140, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M 150 150 L ${start.x} ${start.y} A 140 140 0 ${largeArc} 1 ${end.x} ${end.y} Z`
}

export default function RouletteGame({ rouletteState, updateRouletteState, onRewardPoints, onRewardCoupon, onBack }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState('')
  const [rouletteMessage, setRouletteMessage] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizMessage, setQuizMessage] = useState(null)
  const [bonusOpen, setBonusOpen] = useState(false)
  const [prizeModal, setPrizeModal] = useState(null)
  const [manualConfirmOpen, setManualConfirmOpen] = useState(false)
  const spinLockRef = useRef(false)
  const quizLockRef = useRef(false)

  const todayKey = getLocalDateKey()
  const quizInfo = getDailyQuiz()
  const quizCompleted = rouletteState.quizCompletedDate === todayKey
  const totalWeight = rouletteItems.reduce((sum, item) => sum + item.weight, 0)
  let accumulatedAngle = 0
  const rouletteSectors = rouletteItems.map(item => {
    const startAngle = accumulatedAngle
    const angle = item.weight / totalWeight * 360
    const endAngle = startAngle + angle
    accumulatedAngle = endAngle
    return { ...item, startAngle, endAngle, midAngle: startAngle + angle / 2, angle }
  })

  useEffect(() => {
    setSelectedAnswer(null)
    setQuizMessage(null)
    setManualConfirmOpen(false)
  }, [todayKey])

  function spinRoulette() {
    if (spinLockRef.current || spinning) return
    if (rouletteState.ticketCount <= 0) {
      setRouletteMessage('룰렛 티켓이 없어요 😢 아래 BONUS CHANCE에 도전해보세요!')
      return
    }

    spinLockRef.current = true
    setSpinning(true)
    setResult('')
    setRouletteMessage('행운을 고르는 중...')
    updateRouletteState(current => ({ ...current, ticketCount: Math.max(0, current.ticketCount - 1) }))

    const selectedIndex = pickWeightedItem()
    const selectedSector = rouletteSectors[selectedIndex]
    const currentTurns = Math.ceil(rotation / 360)
    const target = (currentTurns + 5) * 360 + (360 - selectedSector.midAngle)
    setRotation(target)

    window.setTimeout(() => {
      const prize = rouletteItems[selectedIndex]
      setResult(`${prize.icon} ${prize.label}`)
      if (prize.rewardType === 'points') onRewardPoints(prize.rewardValue)
      if (prize.rewardType === 'coupon') onRewardCoupon(prize.rewardValue)
      if (prize.rewardType === 'message') setPrizeModal(prize)
      setRouletteMessage('')
      setSpinning(false)
      spinLockRef.current = false
    }, 3200)
  }

  function submitQuiz() {
    if (quizLockRef.current || quizCompleted || selectedAnswer === null || quizInfo.status !== 'active') return
    if (quizInfo.quiz.type === 'manual') {
      setManualConfirmOpen(true)
      return
    }
    quizLockRef.current = true

    const isCorrect = quizInfo.quiz.type === 'text'
      ? String(selectedAnswer).replace(/\s+/g, '') === quizInfo.quiz.answer
      : selectedAnswer === quizInfo.quiz.answer

    if (isCorrect) {
      completeDailyQuiz()
    } else {
      setQuizMessage({ correct: false, text: '땡! 😏 아직 여자친구 공부가 부족하시군요.' })
      if (!ALLOW_QUIZ_RETRY) {
        updateRouletteState(current => ({ ...current, quizCompletedDate: todayKey }))
      }
    }

    window.setTimeout(() => { quizLockRef.current = false }, 300)
  }

  function completeDailyQuiz() {
    const latest = updateRouletteState(current => {
      if (current.quizCompletedDate === todayKey) return current
      return { ...current, ticketCount: current.ticketCount + 1, quizCompletedDate: todayKey }
    })
    if (latest.quizCompletedDate === todayKey) {
      setQuizMessage({ correct: true, text: '🎉 정답! 역시 서희잘알 조동신 · 룰렛 티켓 +1' })
    }
  }

  function judgeManualQuiz(correct) {
    if (quizLockRef.current || quizCompleted) return
    quizLockRef.current = true
    setManualConfirmOpen(false)
    if (correct) completeDailyQuiz()
    else {
      setQuizMessage({ correct: false, text: '땡! 😏 아직 여자친구 공부가 부족하시군요.' })
      if (!ALLOW_QUIZ_RETRY) updateRouletteState(current => ({ ...current, quizCompletedDate: todayKey }))
    }
    window.setTimeout(() => { quizLockRef.current = false }, 300)
  }

  return (
    <div className="game-screen roulette-screen">
      <button className="game-back" onClick={onBack}>⬅️ BACK (게임 목록으로)</button>

      <header className="roulette-header">
        <div><span>LUCKY ROULETTE</span><h3>행운의 룰렛</h3></div>
        <div className="ticket-counter"><span>🎟️ TICKET</span><strong>{rouletteState.ticketCount}</strong></div>
      </header>

      <div className="roulette-wheel-wrap">
        <div className="roulette-pointer" aria-hidden="true" />
        <div className="roulette-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
          <svg viewBox="0 0 300 300" role="img" aria-label="당첨 확률에 따라 칸 크기가 다른 행운의 룰렛">
            {rouletteSectors.map(sector => {
              const labelPoint = polarPoint(150, sector.rare ? 106 : 88, sector.midAngle)
              return (
                <g key={sector.label} className={sector.rare ? 'roulette-sector rare' : 'roulette-sector'}>
                  <path d={createSectorPath(sector.startAngle, sector.endAngle)} fill={sector.color} />
                  <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle">
                    {sector.angle <= 20 ? sector.icon : `${sector.icon} ${sector.label}`}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <div className="roulette-wheel-center">LUCK</div>
      </div>

      <div className="roulette-legend">
        {rouletteItems.map(item => <span key={item.label} className={item.rare ? 'rare' : ''}>{item.icon} {item.label} <strong>{item.weight}%</strong></span>)}
      </div>

      <button
        type="button"
        className="roulette-spin-btn"
        onClick={spinRoulette}
        disabled={spinning || rouletteState.ticketCount <= 0}
      >
        {spinning ? '돌아가는 중...' : rouletteState.ticketCount > 0 ? '룰렛 돌리기' : '티켓이 없어요'}
      </button>
      {(rouletteMessage || result) && (
        <div className={`roulette-result${result ? ' won' : ''}`} role="status">
          {result ? `✨ ${result} ✨` : rouletteMessage}
        </div>
      )}

      <section className="bonus-chance">
        <button type="button" className="bonus-toggle" onClick={() => setBonusOpen(open => !open)} aria-expanded={bonusOpen}>
          <span className="bonus-title-row">
            <span><span className="bonus-kicker">BONUS CHANCE</span><strong>오늘의 서희 QUIZ 💡</strong></span>
            <span className="bonus-toggle-side"><span className="bonus-chevron">{bonusOpen ? '−' : '+'}</span></span>
          </span>
        </button>

        {bonusOpen && (quizCompleted ? (
          <div className="quiz-completed">오늘의 BONUS CHANCE 완료 ✓</div>
        ) : quizInfo.status === 'before' ? (
          <div className="quiz-unavailable">BONUS CHANCE가 아직 시작되지 않았어요.</div>
        ) : quizInfo.status === 'after' ? (
          <div className="quiz-unavailable">13일간의 BONUS CHANCE가 종료되었어요.</div>
        ) : (
          <>
            <p className="bonus-description">오늘의 서희 퀴즈를 맞히면 티켓 +1</p>
            <div className="quiz-question">Q. {quizInfo.quiz.question}</div>
                {quizInfo.quiz.type === 'text' ? (
                  <input
                    className="quiz-text-input"
                    value={selectedAnswer || ''}
                    placeholder={quizInfo.quiz.placeholder}
                    onChange={event => { setSelectedAnswer(event.target.value); setQuizMessage(null) }}
                  />
                ) : (
                  <div className="quiz-options">
                    {quizInfo.quiz.options.map((option, index) => (
                      <button
                        type="button"
                        key={option}
                        className={selectedAnswer === index ? 'selected' : ''}
                        onClick={() => { setSelectedAnswer(index); setQuizMessage(null) }}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>{option}
                      </button>
                    ))}
                  </div>
                )}
                <button type="button" className="quiz-submit" onClick={submitQuiz} disabled={selectedAnswer === null || String(selectedAnswer).trim() === '' || quizLockRef.current}>
                  {quizInfo.quiz.type === 'manual' ? '서희에게 확인하기' : '정답 제출하기'}
                </button>
                {quizMessage && <div className={`quiz-message ${quizMessage.correct ? 'correct' : 'wrong'}`} role="status">{quizMessage.text}</div>}
          </>
        ))}
      </section>

      {prizeModal && (
        <div className="roulette-prize-backdrop">
          <div className="roulette-prize-modal" role="dialog" aria-modal="true" aria-labelledby="roulette-prize-title">
            <div className="roulette-prize-icon">{prizeModal.icon}</div>
            <span>CONGRATULATIONS</span>
            <h4 id="roulette-prize-title">{prizeModal.label}</h4>
            <p>오늘은 뽀뽀 한 번 더 받는 날이에요!</p>
            <button type="button" onClick={() => setPrizeModal(null)}>확인</button>
          </div>
        </div>
      )}

      {manualConfirmOpen && (
        <div className="quiz-manual-backdrop">
          <div className="quiz-manual-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-manual-title">
            <span>서희에게 확인하기</span>
            <h4 id="quiz-manual-title">“{quizInfo.quiz.options[selectedAnswer]}”</h4>
            <p>동신이의 선택이 정답인가요?</p>
            <div>
              <button type="button" onClick={() => judgeManualQuiz(false)}>오답 처리</button>
              <button type="button" className="correct" onClick={() => judgeManualQuiz(true)}>정답 처리</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
