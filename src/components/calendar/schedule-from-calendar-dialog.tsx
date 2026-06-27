'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Student } from '@/lib/types'
import { scheduleLesson } from '@/app/(app)/students/[id]/actions'

interface Props {
  start: string
  end: string
  students: Student[]
  open: boolean
  onClose: () => void
}

export function ScheduleLessonFromCalendarDialog({ start, end, students, open, onClose }: Props) {
  const [studentId, setStudentId] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startDt = new Date(start)
  const endDt = new Date(end)
  const defaultDuration = Math.round((endDt.getTime() - startDt.getTime()) / 60000) || 60

  function toLocalInputValue(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const selectedStudent = students.find(s => s.id === studentId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedStudent) return
    const fd = new FormData(e.currentTarget)
    setError(null)
    setPending(true)
    try {
      await scheduleLesson(studentId, {
        scheduledAt: new Date(fd.get('scheduled_at') as string).toISOString(),
        durationMinutes: Number(fd.get('duration_minutes')),
        rateAtTime: selectedStudent.hourly_rate,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule lesson')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Schedule lesson</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label>Student</Label>
            <Select value={studentId} onValueChange={(v) => { if (v) setStudentId(v) }} required>
              <SelectTrigger><SelectValue placeholder="Select student…">{selectedStudent?.name}</SelectValue></SelectTrigger>
              <SelectContent>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date & time</Label>
            <Input
              name="scheduled_at"
              type="datetime-local"
              defaultValue={toLocalInputValue(startDt)}
              required
            />
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Input
              name="duration_minutes"
              type="number"
              defaultValue={defaultDuration}
              min="15"
              step="15"
              required
            />
          </div>
          {selectedStudent && (
            <div className="text-xs text-gray-400">Rate: €{selectedStudent.hourly_rate}/hr</div>
          )}
          {error && <div className="text-xs text-red-500">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={pending || !studentId} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
