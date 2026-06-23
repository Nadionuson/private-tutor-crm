import { createClient } from '@/lib/supabase/server'
import { computeStats } from '@/lib/compute-stats'
import { StudentWithStats } from '@/lib/types'

const STUDENT_QUERY = `
  *,
  lessons(id, student_id, scheduled_at, duration_minutes, rate_at_time, status, created_at, lesson_notes(*)),
  payments(id, student_id, amount, paid_at, notes, created_at)
`

export async function getStudentsWithStats(): Promise<StudentWithStats[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select(STUDENT_QUERY)
    .order('name')
  if (error) throw error
  return data.map(computeStats)
}

export async function getStudentWithStats(id: string): Promise<StudentWithStats> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select(STUDENT_QUERY)
    .eq('id', id)
    .single()
  if (error) throw error
  return computeStats(data)
}
