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
  const [contactError, setContactError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = (fd.get('parent_email') as string).trim()
    const phone = (fd.get('parent_phone') as string).trim()
    if (!email && !phone) {
      setContactError('Indique pelo menos um email ou telefone do encarregado.')
      return
    }
    setContactError(null)
    setPending(true)
    try {
      await createStudent(fd)
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ background: '#6366f1' }}>+ Adicionar aluno</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar aluno</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="grade">Ano escolar</Label>
                <Input id="grade" name="grade" placeholder="ex: 5.º" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input id="age" name="age" type="number" min="1" max="20" required />
              </div>
              <div>
                <Label htmlFor="hourly_rate">Valor/hora (€)</Label>
                <Input id="hourly_rate" name="hourly_rate" type="number" step="0.01" min="0.01" required />
              </div>
            </div>
            <div>
              <Label htmlFor="start_date">Data de início</Label>
              <Input id="start_date" name="start_date" type="date" required />
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Encarregado de educação
              </p>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="parent_name">Nome</Label>
                  <Input id="parent_name" name="parent_name" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="parent_email">Email</Label>
                    <Input id="parent_email" name="parent_email" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="parent_phone">Telefone</Label>
                    <Input id="parent_phone" name="parent_phone" />
                  </div>
                </div>
                {contactError && (
                  <p className="text-xs text-red-500">{contactError}</p>
                )}
                <p className="text-xs text-gray-400">Indique pelo menos email ou telefone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={pending} style={{ background: '#6366f1' }}>
                {pending ? 'A guardar…' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
