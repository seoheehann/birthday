import React, { useState } from 'react'
import { readMockExamAnswers } from './MockExam'

export default function MockExamAdmin() {
  const [answers, setAnswers] = useState(readMockExamAnswers)

  function refreshAnswers() {
    setAnswers(readMockExamAnswers())
  }

  function downloadAnswers() {
    const blob = new Blob([JSON.stringify(answers, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dongshin-mock-exam-answers.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="admin-screen">
      <header className="admin-header">
        <div>
          <div className="admin-eyebrow">PRIVATE ADMIN</div>
          <h1>동신 모의고사 답변함</h1>
          <p>현재 브라우저에 저장된 답변을 확인할 수 있어요.</p>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={refreshAnswers}>새로고침</button>
          <button type="button" onClick={downloadAnswers} disabled={!answers.length}>JSON 다운로드</button>
        </div>
      </header>

      <section className="admin-answer-list" aria-live="polite">
        {!answers.length && <div className="admin-empty">아직 제출된 답변이 없어요.</div>}
        {answers.slice().reverse().map(item => (
          <article className="admin-answer" key={`${item.dateKey}-${item.answeredAt}`}>
            <div className="admin-answer-meta"><strong>{item.dateKey}</strong><span>{new Date(item.answeredAt).toLocaleString('ko-KR')}</span></div>
            <div className="admin-answer-question">Q. {item.question}</div>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  )
}