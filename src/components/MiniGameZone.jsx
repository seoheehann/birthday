import React, { useState, useEffect } from 'react'
import RouletteGame from './RouletteGame'
import CouponPocketModal from './CouponPocketModal'

const missions = [
  '서희가 입을 옷 골라주기',
  '롤체 한 판 같이 하기',
  '공주님 안기하고 3바퀴 돌기',
  '오늘의 셀카 보내기',
  '오늘 먹을 메뉴 서로 하나씩 추천하고 가위바위보로 결정하기',
  '예쁜 모닝 카톡 하나 보내기',
  '오늘 서희가 먹고 싶은 음식 맞추기',
  '카톡 방에 "사랑해" 검색해서 누가 더 많이 말했는 지 확인하기',
  '자기 전에 오늘 좋았던 일 하나씩 공유하기',
  '잠들기 전에 머리 쓰다듬어 주기',
  '내일의 생일 소원 적기'
]

// 2026년 9월 6일에 missions[0]부터 하루에 하나씩 순서대로 표시합니다.
const MISSION_START_DATE = new Date(2026, 8, 6)

const games = [
  { id: 'daily', icon: '📅', title: '매일 미션 수행하기', sub: '하루에 하나씩!' },
  { id: 'roulette', icon: '🎰', title: '행운의 룰렛', sub: '오늘의 운세 & 럭키 보상' },
  { id: 'balance', icon: '⚖️', title: '밸런스 게임', sub: '내 마음을 공부하는 선택' },
]

const shopItems = [
  { id: 'coffee', icon: '🔞', name: '19금 절대 권력권', description: '원하는 때, 원하는 곳에서 하고 싶은 대로 다 해드리는 19금 절대 권력', price: 1000 },
  { id: 'dessert', icon: '👩‍🍳', name: '무엇이든 요리해 드립니다! 서희표 1:1 수제 요리권', description: '원하는 메뉴를 서희가 직접 만들어주는 특별 요리권', price: 400 },
  { id: 'wish', icon: '🪄', name: '소원 이용권', description: '귀여운 소원 하나 들어주기', price: 800, forSale: false },
  { id: 'date', icon: '💌', name: '데이트 선택권', description: '다음 데이트 코스를 직접 정하기', price: 1000, forSale: false },
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

export default function MiniGameZone({ rouletteState, updateRouletteState }) {
  const [view, setView] = useState('list') // 'list' or game id
  const [points, setPoints] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [missionDone, setMissionDone] = useState(false)
  const [confettiBurst, setConfettiBurst] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState([])
  const [shopMessage, setShopMessage] = useState('')
  const [usedCouponIds, setUsedCouponIds] = useState([])
  const [couponPocketOpen, setCouponPocketOpen] = useState(false)

  const todayKey = getTodayKey()
  const missionText = getMissionForToday(new Date())

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('miniPoints') || '0', 10)
      if (!isNaN(v)) setPoints(v)
      const parsedItems = JSON.parse(localStorage.getItem('miniShopPurchases') || '[]')
      const savedItems = Array.isArray(parsedItems) ? parsedItems.filter(itemId => typeof itemId === 'string') : []
      setPurchasedItems(savedItems)
      const savedUsedCoupons = JSON.parse(localStorage.getItem('miniShopUsedCoupons') || '[]')
      if (Array.isArray(savedUsedCoupons)) {
        const migratedUsedCoupons = savedUsedCoupons.map(usedId => {
          if (!savedItems.includes(usedId)) return usedId
          return `${usedId}-${savedItems.indexOf(usedId)}`
        })
        setUsedCouponIds(migratedUsedCoupons)
        try { localStorage.setItem('miniShopUsedCoupons', JSON.stringify(migratedUsedCoupons)) } catch (e) {}
      }
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

  function handlePurchase(item) {
    if (points < item.price) {
      setShopMessage((item.price - points) + ' PT가 더 필요해요!')
      return
    }
    const nextPoints = points - item.price
    const nextItems = [...purchasedItems, item.id]
    setPoints(nextPoints)
    setPurchasedItems(nextItems)
    setShopMessage(item.name + ' 구매 완료! 🎉')
    try {
      localStorage.setItem('miniPoints', String(nextPoints))
      localStorage.setItem('miniShopPurchases', JSON.stringify(nextItems))
    } catch (e) {}
  }

  function handleUseCoupon(couponId) {
    if (!purchasedCoupons.some(coupon => coupon.instanceId === couponId) || usedCouponIds.includes(couponId)) return
    const nextUsedCouponIds = [...usedCouponIds, couponId]
    setUsedCouponIds(nextUsedCouponIds)
    try { localStorage.setItem('miniShopUsedCoupons', JSON.stringify(nextUsedCouponIds)) } catch (e) {}
  }

  function handleRoulettePointReward(amount) {
    setPoints(currentPoints => {
      const nextPoints = currentPoints + amount
      try { localStorage.setItem('miniPoints', String(nextPoints)) } catch (e) {}
      return nextPoints
    })
  }

  function handleRouletteCouponReward(itemId) {
    if (!shopItems.some(item => item.id === itemId)) return
    setPurchasedItems(currentItems => {
      const nextItems = [...currentItems, itemId]
      try { localStorage.setItem('miniShopPurchases', JSON.stringify(nextItems)) } catch (e) {}
      return nextItems
    })
  }

  const purchasedCoupons = purchasedItems.map((itemId, purchaseIndex) => {
    const item = shopItems.find(shopItem => shopItem.id === itemId)
    return item ? { ...item, instanceId: `${itemId}-${purchaseIndex}` } : null
  }).filter(Boolean)
  const availableCouponCount = purchasedCoupons.filter(item => !usedCouponIds.includes(item.instanceId)).length

  return (
    <div className="mini-zone screen">
      <div className="mini-zone-inner container">
        <header className="mini-header">
          <div>
            <h2 className="mini-title">MINI-GAME ZONE</h2>
            <div className="mini-sub">미션을 완수하고 포인트를 획득하세요</div>
          </div>
          <div className="mini-header-actions">
            <div className="mini-points">POINTS: <span className="pts">{points} PT</span> <span className="coin">🪙</span></div>
            <button type="button" className="coupon-pocket-btn" onClick={() => setCouponPocketOpen(true)}>🎫 내 쿠폰함 ({availableCouponCount})</button>
          </div>
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
            <button type='button' className='shop-entry' onClick={() => openGame('shop')}>
              <span className='shop-entry-icon' aria-hidden='true'>🎁</span>
              <span className='shop-entry-copy'>
                <span className='shop-entry-label'>POINT SHOP</span>
                <strong>포인트 상점</strong>
                <small>모은 포인트를 특별한 선물로 교환하세요</small>
              </span>
              <span className='shop-entry-balance'>
                <strong>{points} PT</strong>
                <span>SHOP →</span>
              </span>
            </button>
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

        {view === 'shop' && (
          <div className='game-screen shop-screen'>
            <button className='game-back' onClick={backToList}>⬅️ BACK (게임 목록으로)</button>
            <div className='shop-header'>
              <div><div className='shop-eyebrow'>POINT SHOP</div><h3>포인트 상점</h3><p>미션으로 모은 포인트를 특별한 선물로 바꿔보세요.</p></div>
              <div className='shop-balance'><span>보유 포인트</span><strong>{points} PT</strong></div>
            </div>
            {shopMessage && <div className='shop-message' role='status'>{shopMessage}</div>}
            <div className='shop-grid'>
              {shopItems.filter(item => item.forSale !== false).map(item => {
                return (
                  <article className='shop-item' key={item.id}>
                    <div className='shop-item-icon' aria-hidden='true'>{item.icon}</div>
                    <div className='shop-item-info'><h4>{item.name}</h4><p>{item.description}</p></div>
                    <button type='button' className='shop-buy-btn' onClick={() => handlePurchase(item)} data-affordable={points >= item.price}>
                      {item.price + ' PT'}
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {view === 'roulette' && (
          <RouletteGame
            rouletteState={rouletteState}
            updateRouletteState={updateRouletteState}
            onRewardPoints={handleRoulettePointReward}
            onRewardCoupon={handleRouletteCouponReward}
            onBack={backToList}
          />
        )}

        {view !== 'list' && view !== 'daily' && view !== 'shop' && view !== 'roulette' && (
          <div className={`game-screen game-${view}`}>
            <button className="game-back" onClick={backToList}>⬅️ BACK (게임 목록으로)</button>
            <div className="game-skeleton">
              <h3>{games.find(g => g.id === view)?.title || '게임'}</h3>
              <p className="muted">게임 준비 중</p>
            </div>
          </div>
        )}
      </div>
      {couponPocketOpen && (
        <CouponPocketModal
          coupons={purchasedCoupons}
          usedCouponIds={usedCouponIds}
          onUseCoupon={handleUseCoupon}
          onClose={() => setCouponPocketOpen(false)}
        />
      )}
    </div>
  )
}
