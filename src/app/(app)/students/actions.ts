'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createStudent(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('students').insert({
    name: formData.get('name') as string,
    age: Number(formData.get('age')),
    grade: formData.get('grade') as string,
    parent_name: formData.get('parent_name') as string,
    parent_email: formData.get('parent_email') as string,
    parent_phone: formData.get('parent_phone') as string,
    hourly_rate: Number(formData.get('hourly_rate')),
    start_date: formData.get('start_date') as string,
  })
  if (error) throw error
  revalidatePath('/students')
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('students').update({
    name: formData.get('name') as string,
    age: Number(formData.get('age')),
    grade: formData.get('grade') as string,
    parent_name: formData.get('parent_name') as string,
    parent_email: formData.get('parent_email') as string,
    parent_phone: formData.get('parent_phone') as string,
    start_date: formData.get('start_date') as string,
  }).eq('id', id)
  if (error) throw error
  revalidatePath(`/students/${id}`)
}

export async function updateHourlyRate(id: string, newRate: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('students')
    .update({ hourly_rate: newRate })
    .eq('id', id)
  if (error) throw error
  revalidatePath(`/students/${id}`)
}

export async function updateAvatar(id: string, avatarUrl: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('students')
    .update({ avatar_url: avatarUrl })
    .eq('id', id)
  if (error) throw error
  revalidatePath(`/students/${id}`)
  revalidatePath('/students')
}
