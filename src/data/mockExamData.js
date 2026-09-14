import { getLocalDateKey } from '../utils/rouletteStorage'

export const MOCK_EXAM_START_DATE = '2026-09-10'

export const mockExamQuestions = [
  '나한테 서운/속상했는데 아직 제대로 말하지 못한 일이 있어?',
  '생일날 저녁 먹고싶은 메뉴는?',
]

const questionsByDate = {
  '2026-09-14': '먹고싶은 케이크 종류는? (초코, 치즈, 티라미수, 생크림 등등)',
}

export function getDailyMockExam(date = new Date()) {
  const dateKey = getLocalDateKey(date)
  const [year, month, day] = MOCK_EXAM_START_DATE.split('-').map(Number)
  const startDate = Date.UTC(year, month - 1, day)
  const currentDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const dayIndex = Math.floor((currentDate - startDate) / 86400000)
  const question = questionsByDate[dateKey] ?? mockExamQuestions[((dayIndex % mockExamQuestions.length) + mockExamQuestions.length) % mockExamQuestions.length]

  return { dateKey, question }
}
