import { createClient } from '@/lib/supabase/server'
import { LessonWithNotes } from '@/lib/types'

export async function getLessonsWithStudent(from: Date, to: Date) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*, lesson_notes(*), students(id, name, avatar_url, grade)')
    .gte('scheduled_at', from.toISOString())
    .lte('scheduled_at', to.toISOString())
    .order('scheduled_at')
  if (error) throw error
  return data
}

export async function getUpcomingLessons(limit = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*, lesson_notes(*), students(id, name, avatar_url, grade, hourly_rate)')
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at')
    .limit(limit)
  if (error) throw error
  return data
}
