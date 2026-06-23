import { createClient } from '@/lib/supabase/server'

export async function getRecentPayments(limit = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .select('*, students(id, name, avatar_url)')
    .order('paid_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getAllPaymentsWithStudents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .select('*, students(id, name, avatar_url)')
    .order('paid_at', { ascending: false })
  if (error) throw error
  return data
}
