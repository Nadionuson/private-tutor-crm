'use client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
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
        <Button
          onClick={signInWithGoogle}
          className="w-full"
          style={{ background: '#6366f1' }}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
