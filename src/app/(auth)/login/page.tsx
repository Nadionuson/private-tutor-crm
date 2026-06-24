'use client'
import { useState, useTransition } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startTransition(async () => {
      const result = await login(fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1f0f8' }}>
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-10 w-full max-w-sm text-center">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6"
          style={{ background: '#6366f1', fontFamily: 'Georgia, serif' }}
        >
          ∑
        </div>
        <h1 className="text-xl font-bold text-indigo-950 mb-1">MathTutor CRM</h1>
        <p className="text-sm text-gray-400 mb-8">Private lessons management</p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: '#6366f1' }}
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
