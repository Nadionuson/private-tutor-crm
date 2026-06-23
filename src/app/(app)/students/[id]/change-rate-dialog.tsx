'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateHourlyRate } from '@/app/(app)/students/actions'

export function ChangeRateDialog({ studentId, currentRate }: { studentId: string; currentRate: number }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPending(true)
    try {
      await updateHourlyRate(studentId, Number(fd.get('rate')))
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-indigo-500 hover:underline mt-1 block">Change rate</button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change hourly rate</DialogTitle>
        </DialogHeader>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 mb-3">
          This applies to <strong>future lessons only</strong>. Past lessons keep their original rate.
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="rate">New rate (€/hr)</Label>
            <Input
              id="rate"
              name="rate"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={currentRate}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Update rate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
