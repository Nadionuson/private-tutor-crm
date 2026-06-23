'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { completeLesson, cancelLesson } from '@/app/(app)/students/[id]/actions'
import { formatDateTime, formatCurrency, lessonCost } from '@/lib/utils'

interface CalendarLesson {
  id: string
  student_id: string
  scheduled_at: string
  duration_minutes: number
  rate_at_time: number
  status: string
  students: { name: string; grade: string }
}

export function LessonEventDialog({ lesson, open, onClose }: { lesson: CalendarLesson; open: boolean; onClose: () => void }) {
  const [pending, setPending] = useState<'complete' | 'cancel' | null>(null)

  async function handleComplete() {
    setPending('complete')
    try {
      await completeLesson(lesson.id, lesson.student_id, lesson.duration_minutes)
      onClose()
    } finally {
      setPending(null)
    }
  }

  async function handleCancel() {
    setPending('cancel')
    try {
      await cancelLesson(lesson.id, lesson.student_id)
      onClose()
    } finally {
      setPending(null)
    }
  }

  const cost = lessonCost(lesson.duration_minutes, lesson.rate_at_time)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{lesson.students?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-1">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-indigo-50 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-400">When</div>
              <div className="font-semibold text-indigo-950">{formatDateTime(lesson.scheduled_at)}</div>
            </div>
            <div className="bg-indigo-50 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-400">Duration</div>
              <div className="font-semibold text-indigo-950">{lesson.duration_minutes} min</div>
            </div>
            <div className="bg-indigo-50 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-400">Grade</div>
              <div className="font-semibold text-indigo-950">{lesson.students?.grade}</div>
            </div>
            <div className="bg-indigo-50 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-400">Value</div>
              <div className="font-semibold text-indigo-950">{formatCurrency(cost)}</div>
            </div>
          </div>

          {lesson.status === 'scheduled' && (
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleComplete}
                disabled={!!pending}
                className="flex-1"
                style={{ background: '#6366f1' }}
              >
                {pending === 'complete' ? '…' : '✓ Mark complete'}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={!!pending}
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                {pending === 'cancel' ? '…' : 'Cancel'}
              </Button>
            </div>
          )}

          {lesson.status !== 'scheduled' && (
            <div className={`text-center text-sm font-semibold py-2 rounded-lg ${lesson.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {lesson.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
