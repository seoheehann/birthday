import React, { useState, useEffect } from 'react'

const missions = [
  '뽀뽀 5번 해주기',
  '같이 산책 20분',
  '1분 동안 안아주기',
  '애교 보여주기',
  '머리 쓰다듬어 주면서 예쁘게 바라봐주기',
  '서로 1분씩 마사지 해주기',
  '맛있는 거 먹을 때 첫 입 서로에게 먹여주기',
  '미래에 대한 예쁜 상상 하나 말해주기',
  '서로 음료수 골라주기',
  '서희가 입을 옷 골라주기',
  '롤체 한 판 같이 하기',
  '공주님 안기하고 3바퀴 돌기',
]

// 오늘을 첫 번째 미션의 시작일로 사용합니다.
const MISSION_START_DATE = new Date(2026, 7, 16)

const games = [
  { id: 'daily', icon: '📅', title: '매일 미션 수행하기', sub: '하루에 하나씩!' },
  { id: 'mock', icon: '🧠', title: '동신 모의고사', sub: 'INTP 맞춤 N문 N답 퀴즈' },
  { id: 'roulette', icon: '🎰', title: '행운의 룰렛', sub: '오늘의 운세 & 럭키 보상' },
  { id: 'balance', icon: '⚖️', title: '밸런스 게임', sub: '내 마음을 공부하는 선택' },
]

function getTodayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getMissionForToday(date = new Date()) {
  const startDay = Date.UTC(
    MISSION_START_DATE.getFullYear(),
    MISSION_START_DATE.getMonth(),
    MISSION_START_DATE.getDate(),
  )
  const currentDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const dayIndex = Math.floor((currentDay - startDay) / 86400000)
  const missionIndex = ((dayIndex % missions.length) + missions.length) % missions.length

  return missions[missionIndex]
}

function getTimeUntilMidnight(now = new Date()) {
  const nextMidnight = new Date(now)
  nextMidnight.setHours(24, 0, 0, 0)
  const diff = nextMidnight.getTime() - now.getTime()

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { hours, minutes, seconds }
}

export default function MiniGameZone() {
  const [view, setView] = useState('list') // 'list' or game id
  const [points, setPoints] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [missionDone, setMissionDone] = useState(false)
  const [confettiBurst, setConfettiBurst] = useState(false)

  const todayKey = getTodayKey()
  const missionText = getMissionForToday(new Date())

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('miniPoints') || '0', 10)
      if (!isNaN(v)) setPoints(v)
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      const done = localStorage.getItem(`dailyMissionDone:${todayKey}`) === 'true'
      setMissionDone(done)
    } catch (e) {
      setMissionDone(false)
    }
  }, [todayKey])

  useEffect(() => {
    try { localStorage.setItem('miniPoints', String(points)) } catch (e) {}
  }, [points])

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeUntilMidnight(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  function openGame(id) {
    setView(id)
  }

  function backToList() {
    setView('list')
  }

  function handleMissionComplete() {
    if (missionDone) return

    const nextPoints = points + 100
    setPoints(nextPoints)
    setMissionDone(true)
    setConfettiBurst(true)

    try {
      localStorage.setItem(`dailyMissionDone:${todayKey}`, 'true')
      localStorage.setItem('miniPoints', String(nextPoints))
    } catch (e) {}

    window.setTimeout(() => setConfettiBurst(false), 1500)
  }

  return (
    <div className="mini-zone screen">
      <div className="mini-zone-inner container">
        <header className="mini-header">
          <div>
            <h2 className="mini-title">MINI-GAME ZONE</h2>
            <div className="mini-sub">미션을 완수하고 포인트를 획득하세요</div>
          </div>
          <div className="mini-points">POINTS: <span className="pts">{points} PT</span> <span className="coin">🪙</span></div>
        </header>

        {view === 'list' && (
          <div className="mini-grid" role="list">
            {games.map(g => (
              <button key={g.id} className="mini-card" onClick={() => openGame(g.id)} role="listitem">
                <div className="card-icon">{g.icon}</div>
                <div className="card-title">{g.title}</div>
                <div className="card-sub">{g.sub}</div>
              </button>
            ))}
          </div>
        )}

        {view === 'daily' && (
          <div className="game-screen mission-screen">
            <button className="game-back" onClick={backToList}>⬅️ BACK (목록으로)</button>
            <div className="mission-header-row">
              <h3>DAILY MISSION</h3>
            </div>

            <div className="timer-card">
              <div className="timer-label">다음 미션까지</div>
              <div className="timer-display">
                {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')} 남음
              </div>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">TODAY'S MISSION</div>
              <div className="mission-text">{missionText}</div>
              <div className="mission-emoji" aria-hidden="true">💖</div>
            </div>

            <button
              type="button"
              className="mission-btn"
              onClick={handleMissionComplete}
              disabled={missionDone}
            >
              {missionDone ? '✅ 완료됨 (+100 PT 획득!)' : '미션 완료!'}
            </button>

            {confettiBurst && (
              <div className="confetti-burst" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      '--x': `${(i % 7 - 3) * 18}px`,
                      '--y': `${Math.floor(i / 7) * 18 - 30}px`,
                      '--rot': `${i * 18}deg`,
                      '--delay': `${(i % 8) * 40}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view !== 'list' && view !== 'daily' && (
          <div className={`game-screen game-${view}`}>
            <button className="game-back" onClick={backToList}>⬅️ BACK (게임 목록으로)</button>
            <div className="game-skeleton">
              <h3>{games.find(g => g.id === view)?.title || '게임'}</h3>
              <p className="muted">게임 준비 중</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
