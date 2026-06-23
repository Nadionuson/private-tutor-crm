import { createClient } from '@/lib/supabase/server'
import { AdminEmailList } from './email-list'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: emails } = await supabase
    .from('allowed_emails')
    .select('*')
    .order('added_at')

  return (
    <div>
      <div className="bg-white border-b border-indigo-100 px-7 py-4">
        <h1 className="text-lg font-bold text-indigo-950">Admin</h1>
        <p className="text-xs text-gray-400">Manage who can access this app</p>
      </div>
      <div className="p-7 max-w-lg">
        <AdminEmailList emails={emails ?? []} />
      </div>
    </div>
  )
}
