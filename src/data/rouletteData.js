// 2026년 9월 5일부터 13일간 진행됩니다. 이벤트 일정이 바뀌면 이 값만 수정하세요.
export const EVENT_START_DATE = '2026-09-05'

export const ALLOW_QUIZ_RETRY = true

export const rouletteItems = [
  { label: '100 PT', icon: '🪙', color: '#72591f', weight: 40, rewardType: 'points', rewardValue: 100 },
  { label: '뽀뽀 한 번 더', icon: '💋', color: '#8f3f4d', weight: 30, rewardType: 'message' },
  { label: '서희표 요리권', icon: '🍳', color: '#956f28', weight: 20, rewardType: 'coupon', rewardValue: 'dessert' },
  { label: '1,000 PT', icon: '💰', color: '#d6ad3f', weight: 5, rewardType: 'points', rewardValue: 1000, rare: true },
  { label: '19금 절대 권력권', icon: '🔞', color: '#efca62', weight: 5, rewardType: 'coupon', rewardValue: 'coffee', rare: true },
]

export const dailyQuiz = [
  { type: 'choice', question: '서희가 가장 좋아하는 계절은?', options: ['봄', '여름', '가을', '겨울'], answer: 2 },
  { type: 'choice', question: '서희가 동신이랑 신혼여행으로 가고 싶은 곳은?', options: ['베네치아', '산토리니', '핀란드', '파리'], answer: 1 },
  { type: 'manual', question: '서희가 지금 당장 더 먹고 싶은 음식은?', options: ['닭발', '초밥', '샐러드', '불닭'] },
  { type: 'choice', question: '서희가 가장 좋아하는 스킨십은?', options: ['안기', '뽀뽀', '19금', '키스'], answer: 0 },
  { type: 'choice', question: '서희가 스트레스 받을 때 가장 하고 싶은 것은?', options: ['잠 자기', '게임하기', '동신오빠 만나기', '티비 보기'], answer: 2 },
  { type: 'choice', question: '서희가 절대 안 먹는 음식 재료는?', options: ['오이', '굴', '파인애플 피자', '가지'], answer: 3 },
  { type: 'text', question: '우리의 200일 날짜는?', placeholder: 'oo월 oo일', answer: '10월31일' },
]

export function getDailyQuiz(date = new Date()) {
  const [year, month, day] = EVENT_START_DATE.split('-').map(Number)
  const start = Date.UTC(year, month - 1, day)
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const dayIndex = Math.floor((current - start) / 86400000)
  const quizIndex = ((dayIndex % dailyQuiz.length) + dailyQuiz.length) % dailyQuiz.length

  return { status: 'active', dayIndex, quizIndex, quiz: dailyQuiz[quizIndex] }
}
