'use client'
import { useState } from 'react'
import { AllowedEmail } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addEmail, removeEmail } from './actions'
import { formatDate } from '@/lib/utils'

export function AdminEmailList({ emails }: { emails: AllowedEmail[] }) {
  const [newEmail, setNewEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail) return
    setPending(true)
    try {
      await addEmail(newEmail)
      setNewEmail('')
    } finally {
      setPending(false)
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id)
    try {
      await removeEmail(id)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-indigo-50">
        <h2 className="text-sm font-bold text-indigo-950 mb-3">Authorised emails</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="name@gmail.com"
            className="flex-1"
          />
          <Button type="submit" disabled={pending || !newEmail} style={{ background: '#6366f1' }}>
            {pending ? '…' : 'Add'}
          </Button>
        </form>
      </div>

      {emails.length === 0 && (
        <div className="px-5 py-6 text-center text-sm text-gray-400">No emails yet.</div>
      )}

      {emails.map(e => (
        <div key={e.id} className="flex items-center gap-3 px-5 py-3 border-b border-indigo-50 last:border-0">
          <div className="flex-1">
            <div className="text-sm font-medium text-indigo-950">{e.email}</div>
            <div className="text-xs text-gray-400">Added {formatDate(e.added_at)} by {e.added_by}</div>
          </div>
          <button
            onClick={() => handleRemove(e.id)}
            disabled={removingId === e.id}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            {removingId === e.id ? '…' : 'Remove'}
          </button>
        </div>
      ))}
    </div>
  )
}
