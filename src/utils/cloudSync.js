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

async function ensureAnonymousUser() {
  if (!supabase) return null

  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user) return sessionData.session.user

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.user
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
    for (const answer of readLegacyAnswers()) {
      await supabase.from('mock_exam_answers').insert({
        user_id: user.id,
        answer_date: answer.dateKey,
        question: answer.question,
        answer: answer.answer,
        answered_at: answer.answeredAt || new Date().toISOString(),
      }, { onConflict: 'user_id,answer_date', ignoreDuplicates: true })
    }
    cachePlayerState(user.id, existingState)
    return { status: 'already-migrated', userId: user.id, state: existingState }
  }

  const legacyState = readLegacySnapshot()
  const { data: insertedState, error: insertError } = await supabase
    .from('player_state')
    .insert({
      user_id: user.id,
      ...legacyState,
      migrated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (insertError) throw insertError
  for (const answer of readLegacyAnswers()) {
    await supabase.from('mock_exam_answers').insert({
      user_id: user.id,
      answer_date: answer.dateKey,
      question: answer.question,
      answer: answer.answer,
      answered_at: answer.answeredAt || new Date().toISOString(),
    }, { onConflict: 'user_id,answer_date', ignoreDuplicates: true })
  }
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
  if (!supabase) return { status: 'not-configured' }
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

  if (insertError) throw insertError
  return { status: 'submitted' }
}
