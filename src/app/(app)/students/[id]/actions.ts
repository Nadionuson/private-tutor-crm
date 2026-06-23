'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function scheduleLesson(studentId: string, data: {
  scheduledAt: string
  durationMinutes: number
  rateAtTime: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('lessons').insert({
    student_id: studentId,
    scheduled_at: data.scheduledAt,
    duration_minutes: data.durationMinutes,
    rate_at_time: data.rateAtTime,
    status: 'scheduled',
  })
  if (error) throw error
  revalidatePath(`/students/${studentId}`)
  revalidatePath('/calendar')
  revalidatePath('/')
}

export async function completeLesson(lessonId: string, studentId: string, durationMinutes: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('lessons')
    .update({ status: 'completed', duration_minutes: durationMinutes })
    .eq('id', lessonId)
  if (error) throw error
  revalidatePath(`/students/${studentId}`)
  revalidatePath('/calendar')
  revalidatePath('/')
}

export async function cancelLesson(lessonId: string, studentId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('lessons')
    .update({ status: 'cancelled' })
    .eq('id', lessonId)
  if (error) throw error
  revalidatePath(`/students/${studentId}`)
  revalidatePath('/calendar')
  revalidatePath('/')
}

export async function saveLessonNotes(lessonId: string, studentId: string, data: {
  topic: string
  prepNotes: string
  outcomeNotes: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('lesson_notes').upsert({
    lesson_id: lessonId,
    topic: data.topic,
    prep_notes: data.prepNotes,
    outcome_notes: data.outcomeNotes,
  }, { onConflict: 'lesson_id' })
  if (error) throw error
  revalidatePath(`/students/${studentId}`)
}

export async function logPayment(studentId: string, data: {
  amount: number
  paidAt: string
  notes?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('payments').insert({
    student_id: studentId,
    amount: data.amount,
    paid_at: data.paidAt,
    notes: data.notes ?? null,
  })
  if (error) throw error
  revalidatePath(`/students/${studentId}`)
  revalidatePath('/payments')
  revalidatePath('/')
}
