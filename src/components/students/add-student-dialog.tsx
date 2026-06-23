'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createStudent } from '@/app/(app)/students/actions'

export function AddStudentDialog() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    try {
      await createStudent(new FormData(e.currentTarget))
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ background: '#6366f1' }}>+ Add student</Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" name="grade" placeholder="e.g. 5th" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" min="1" max="20" required />
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly rate (€)</Label>
              <Input id="hourly_rate" name="hourly_rate" type="number" step="0.01" min="0.01" required />
            </div>
          </div>
          <div>
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" name="start_date" type="date" required />
          </div>
          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parent / Guardian</p>
            <div className="space-y-2">
              <div>
                <Label htmlFor="parent_name">Name</Label>
                <Input id="parent_name" name="parent_name" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="parent_email">Email</Label>
                  <Input id="parent_email" name="parent_email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="parent_phone">Phone</Label>
                  <Input id="parent_phone" name="parent_phone" required />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
              {pending ? 'Saving…' : 'Add student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
