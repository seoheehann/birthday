import { supabase } from './supabaseClient'
import { ROULETTE_STORAGE_KEY } from './rouletteStorage'

export const PLAYER_STATE_STORAGE_KEY = 'supabasePlayerState'

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '')
    return value ?? fallback
  } catch (error) {
    return fallback
  }
}

function readLegacySnapshot() {
  return {
    points: Math.max(0, Number.parseInt(localStorage.getItem('miniPoints') || '0', 10) || 0),
    purchasedCoupons: readJson('miniShopPurchases', []),
    usedCouponIds: readJson('miniShopUsedCoupons', []),
    rouletteState: readJson(ROULETTE_STORAGE_KEY, {}),
  }
}

function readLegacyAnswers() {
  return readJson('dongshinMockExamAnswers', [])
}

let authenticationPromise

async function ensureAnonymousUser() {
  if (!supabase) throw new Error('서버 연결 설정이 누락되었어요. 사이트 관리자에게 문의해주세요.')
  if (!authenticationPromise) {
    authenticationPromise = (async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (sessionData.session?.user) return sessionData.session.user
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) throw error
      if (!data.user) throw new Error('사용자 인증에 실패했어요.')
      return data.user
    })().finally(() => { authenticationPromise = null })
  }
  return authenticationPromise
}

async function syncLegacyAnswers(userId) {
  const answers = readLegacyAnswers()
  if (!Array.isArray(answers)) return
  for (const answer of answers) {
    const { error } = await supabase.from('mock_exam_answers').upsert({
      user_id: userId,
      answer_date: answer.dateKey,
      question: answer.question,
      answer: answer.answer,
      answered_at: answer.answeredAt || new Date().toISOString(),
    }, { onConflict: 'user_id,answer_date', ignoreDuplicates: true })
    if (error) throw error
  }
}

function cachePlayerState(userId, state) {
  try {
    localStorage.setItem(PLAYER_STATE_STORAGE_KEY, JSON.stringify({ userId, ...state }))
  } catch (error) {}
}

export async function migrateLegacyState() {
  if (!supabase) return { status: 'not-configured' }

  const user = await ensureAnonymousUser()
  const { data: existingState, error: readError } = await supabase
    .from('player_state')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (readError) throw readError

  if (existingState) {
    await syncLegacyAnswers(user.id)
    cachePlayerState(user.id, existingState)
    return { status: 'already-migrated', userId: user.id, state: existingState }
  }

  const legacyState = readLegacySnapshot()
  const { data: insertedState, error: insertError } = await supabase
    .from('player_state')
    .insert({
      user_id: user.id,
      points: legacyState.points,
      purchased_coupons: legacyState.purchasedCoupons,
      used_coupon_ids: legacyState.usedCouponIds,
      roulette_state: legacyState.rouletteState,
      migrated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (insertError) throw insertError
  await syncLegacyAnswers(user.id)
  cachePlayerState(user.id, insertedState)
  return { status: 'migrated', userId: user.id, state: insertedState }
}

export async function savePlayerState(state) {
  if (!supabase) return null
  const user = await ensureAnonymousUser()
  const { data, error } = await supabase
    .from('player_state')
    .upsert({
      user_id: user.id,
      points: state.points,
      purchased_coupons: state.purchasedCoupons,
      used_coupon_ids: state.usedCouponIds,
      roulette_state: state.rouletteState,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  cachePlayerState(user.id, data)
  return data
}

export async function saveMockExamAnswer({ dateKey, question, answer }) {
  const user = await ensureAnonymousUser()
  const { data: existingAnswer, error: readError } = await supabase
    .from('mock_exam_answers')
    .select('id')
    .eq('user_id', user.id)
    .eq('answer_date', dateKey)
    .maybeSingle()

  if (readError) throw readError
  if (existingAnswer) return { status: 'already-submitted' }

  const { error: insertError } = await supabase
    .from('mock_exam_answers')
    .insert({ user_id: user.id, answer_date: dateKey, question, answer })

  if (insertError?.code === '23505') return { status: 'already-submitted' }
  if (insertError) throw insertError
  return { status: 'submitted' }
}
