'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { logPayment } from '@/app/(app)/students/[id]/actions'
import { formatCurrency } from '@/lib/utils'

interface Props {
  studentId: string
  currentBalance: number
}

export function LogPaymentDialog({ studentId, currentBalance }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPending(true)
    try {
      await logPayment(studentId, {
        amount: Number(fd.get('amount')),
        paidAt: fd.get('paid_at') as string,
        notes: fd.get('notes') as string || undefined,
      })
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ background: '#6366f1' }}>+ Log payment</Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Log payment</DialogTitle>
        </DialogHeader>
        {currentBalance > 0 && (
          <div className="bg-red-50 rounded-lg px-3 py-2 text-xs text-red-600 mb-2">
            Outstanding balance: <strong>{formatCurrency(currentBalance)}</strong>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="amount">Amount (€)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={currentBalance > 0 ? currentBalance.toFixed(2) : ''}
              required
            />
          </div>
          <div>
            <Label htmlFor="paid_at">Date received</Label>
            <Input id="paid_at" name="paid_at" type="date" defaultValue={today} required />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={2} placeholder="e.g. Bank transfer, cash…" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Log payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
