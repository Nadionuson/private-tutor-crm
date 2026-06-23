'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveLessonNotes } from '@/app/(app)/students/[id]/actions'
import { LessonNotes } from '@/lib/types'

interface Props {
  lessonId: string
  studentId: string
  existing: LessonNotes | null
  trigger?: React.ReactNode
}

export function LessonNotesDialog({ lessonId, studentId, existing, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPending(true)
    try {
      await saveLessonNotes(lessonId, studentId, {
        topic: fd.get('topic') as string,
        prepNotes: fd.get('prep_notes') as string,
        outcomeNotes: fd.get('outcome_notes') as string,
      })
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        {trigger ?? (
          <button className="text-xs text-indigo-500 hover:underline">
            {existing ? 'Edit notes' : '+ Add notes'}
          </button>
        )}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit lesson notes' : 'Add lesson notes'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" name="topic" defaultValue={existing?.topic} placeholder="e.g. Fractions — addition & subtraction" />
          </div>
          <div>
            <Label htmlFor="prep_notes">Prep notes</Label>
            <Textarea id="prep_notes" name="prep_notes" defaultValue={existing?.prep_notes} rows={2} placeholder="What was prepared…" />
          </div>
          <div>
            <Label htmlFor="outcome_notes">Outcome notes</Label>
            <Textarea id="outcome_notes" name="outcome_notes" defaultValue={existing?.outcome_notes} rows={2} placeholder="How did it go…" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
