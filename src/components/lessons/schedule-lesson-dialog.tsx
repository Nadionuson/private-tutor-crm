'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { scheduleLesson } from '@/app/(app)/students/[id]/actions'

interface Props {
  studentId: string
  defaultRate: number
  trigger?: React.ReactNode
}

export function ScheduleLessonDialog({ studentId, defaultRate, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPending(true)
    try {
      await scheduleLesson(studentId, {
        scheduledAt: new Date(fd.get('scheduled_at') as string).toISOString(),
        durationMinutes: Number(fd.get('duration_minutes')),
        rateAtTime: defaultRate,
      })
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        {trigger ?? <Button style={{ background: '#6366f1' }}>+ Schedule lesson</Button>}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Schedule lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="scheduled_at">Date & time</Label>
            <Input id="scheduled_at" name="scheduled_at" type="datetime-local" required />
          </div>
          <div>
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input id="duration_minutes" name="duration_minutes" type="number" defaultValue="60" min="15" step="15" required />
          </div>
          <div className="text-xs text-gray-400">Rate: €{defaultRate}/hr</div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
