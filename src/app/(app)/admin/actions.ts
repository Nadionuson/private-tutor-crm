'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addEmail(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('allowed_emails').insert({
    email: email.toLowerCase().trim(),
    added_by: user?.email ?? 'unknown',
  })
  if (error) throw error
  revalidatePath('/admin')
}

export async function removeEmail(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('allowed_emails').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin')
}
