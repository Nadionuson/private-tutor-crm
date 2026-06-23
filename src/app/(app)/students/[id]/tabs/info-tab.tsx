'use client'
import { useState } from 'react'
import { StudentWithStats } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateStudent } from '@/app/(app)/students/actions'

export function InfoTab({ student }: { student: StudentWithStats }) {
  const [editing, setEditing] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    try {
      await updateStudent(student.id, new FormData(e.currentTarget))
      setEditing(false)
    } finally {
      setPending(false)
    }
  }

  if (!editing) {
    return (
      <div className="bg-white border border-indigo-100 rounded-xl p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-sm font-bold text-indigo-950">Student information</h2>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>✎ Edit</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Name', value: student.name },
            { label: 'Age', value: student.age },
            { label: 'Grade', value: `${student.grade} grade` },
            { label: 'Start date', value: student.start_date },
            { label: 'Parent name', value: student.parent_name },
            { label: 'Parent email', value: student.parent_email },
            { label: 'Parent phone', value: student.parent_phone },
          ].map(f => (
            <div key={f.label}>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">{f.label}</div>
              <div className="text-indigo-950 font-medium">{f.value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-5">
      <h2 className="text-sm font-bold text-indigo-950 mb-4">Edit information</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input name="name" defaultValue={student.name} required />
          </div>
          <div>
            <Label>Grade</Label>
            <Input name="grade" defaultValue={student.grade} required />
          </div>
          <div>
            <Label>Age</Label>
            <Input name="age" type="number" defaultValue={student.age} required />
          </div>
          <div>
            <Label>Start date</Label>
            <Input name="start_date" type="date" defaultValue={student.start_date} required />
          </div>
        </div>
        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Parent / Guardian</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input name="parent_name" defaultValue={student.parent_name} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="parent_email" type="email" defaultValue={student.parent_email} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="parent_phone" defaultValue={student.parent_phone} required />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
