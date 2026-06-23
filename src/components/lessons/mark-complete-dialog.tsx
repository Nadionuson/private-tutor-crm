'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { completeLesson, saveLessonNotes } from '@/app/(app)/students/[id]/actions'
import { LessonWithNotes } from '@/lib/types'
import { formatCurrency, lessonCost } from '@/lib/utils'

interface Props {
  lesson: LessonWithNotes
  studentId: string
  open: boolean
  onClose: () => void
}

export function MarkCompleteDialog({ lesson, studentId, open, onClose }: Props) {
  const [duration, setDuration] = useState(lesson.duration_minutes)
  const [step, setStep] = useState<'confirm' | 'notes'>('confirm')
  const [pending, setPending] = useState(false)
  const [notes, setNotes] = useState({
    topic: lesson.lesson_notes?.topic ?? '',
    prepNotes: lesson.lesson_notes?.prep_notes ?? '',
    outcomeNotes: lesson.lesson_notes?.outcome_notes ?? '',
  })

  async function handleComplete() {
    setPending(true)
    try {
      await completeLesson(lesson.id, studentId, duration)
      setStep('notes')
    } finally {
      setPending(false)
    }
  }

  async function handleSaveNotes() {
    setPending(true)
    try {
      await saveLessonNotes(lesson.id, studentId, notes)
      onClose()
    } finally {
      setPending(false)
    }
  }

  const cost = lessonCost(duration, lesson.rate_at_time)

  if (step === 'notes') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add lesson notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={notes.topic}
                onChange={e => setNotes(n => ({ ...n, topic: e.target.value }))}
                placeholder="e.g. Fractions — addition & subtraction"
              />
            </div>
            <div>
              <Label htmlFor="prep">Prep notes</Label>
              <Textarea
                id="prep"
                value={notes.prepNotes}
                onChange={e => setNotes(n => ({ ...n, prepNotes: e.target.value }))}
                placeholder="What was prepared for this lesson…"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="outcome">Outcome notes</Label>
              <Textarea
                id="outcome"
                value={notes.outcomeNotes}
                onChange={e => setNotes(n => ({ ...n, outcomeNotes: e.target.value }))}
                placeholder="How did it go…"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose}>Skip</Button>
              <Button onClick={handleSaveNotes} disabled={pending} style={{ background: '#6366f1' }}>
                {pending ? 'Saving…' : 'Save notes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Mark lesson complete</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label htmlFor="duration">Confirm duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              step="15"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="bg-indigo-50 rounded-lg px-4 py-3 text-sm">
            <div className="text-gray-500">This will accrue</div>
            <div className="text-lg font-bold text-indigo-700">{formatCurrency(cost)}</div>
            <div className="text-xs text-gray-400">to the student's outstanding balance</div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleComplete} disabled={pending} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
