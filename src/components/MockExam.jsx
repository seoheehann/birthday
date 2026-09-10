import React, { useEffect, useState } from 'react'
import { getDailyMockExam } from '../data/mockExamData'
import { saveMockExamAnswer } from '../utils/cloudSync'

const ANSWERS_STORAGE_KEY = 'dongshinMockExamAnswers'

function readAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(ANSWERS_STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch (error) {
    return []
  }
}

export function readMockExamAnswers() {
  return readAnswers()
}

export default function MockExam({ points, onRewardPoints, onBack }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const { dateKey, question } = getDailyMockExam()

  useEffect(() => {
    const existingAnswer = readAnswers().find(item => item.dateKey === dateKey)
    if (existingAnswer) {
      setAnswer(existingAnswer.answer)
      setSubmitted(true)
    }
  }, [dateKey])

  async function submitAnswer() {
    const trimmedAnswer = answer.trim()
    if (!trimmedAnswer || submitted) return

    const nextAnswer = {
      dateKey,
      question,
      answer: trimmedAnswer,
      answeredAt: new Date().toISOString(),
    }
    const nextAnswers = [...readAnswers().filter(item => item.dateKey !== dateKey), nextAnswer]

    try {
      const cloudResult = await saveMockExamAnswer({ dateKey, question, answer: trimmedAnswer })
      if (cloudResult.status === 'already-submitted') {
        setSubmitted(true)
        setMessage('오늘 답변은 이미 제출되었어요.')
        return
      }

      try {
        localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(nextAnswers))
      } catch (error) {}
    } catch (error) {
      setMessage('저장에 실패했어요. 잠시 후 다시 시도해주세요.')
      return
    }

    onRewardPoints(100)
    setSubmitted(true)
    setMessage('답변 저장 완료! 100 PT가 지급되었어요.')
  }

  return (
    <div className="game-screen mock-exam-screen">
      <button className="game-back" onClick={onBack}>⬅️ BACK (게임 목록으로)</button>
      <header className="mock-exam-header">
        <h3>동신 모의고사</h3>
        <p>오늘의 질문에 솔직하게 답해주세요.</p>
      </header>

      <div className="mock-exam-question">
        <span>QUESTION 01 · {dateKey}</span>
        <strong>{question}</strong>
      </div>

      <textarea
        className="mock-exam-answer"
        value={answer}
        onChange={event => { setAnswer(event.target.value); setMessage('') }}
        placeholder="오늘의 답변을 입력해주세요."
        disabled={submitted}
        aria-label="오늘의 모의고사 답변"
      />

      <button type="button" className="mock-exam-submit" onClick={submitAnswer} disabled={submitted || !answer.trim()}>
        {submitted ? '✅ 답변 작성 완료' : '답변 작성 완료 (+100 PT)'}
      </button>
      {message && <div className="mock-exam-message" role="status">{message}</div>}
      {submitted && !message && <div className="mock-exam-completed">오늘 답변은 이미 제출되었어요. 현재 보유 포인트 {points} PT</div>}
    </div>
  )
}