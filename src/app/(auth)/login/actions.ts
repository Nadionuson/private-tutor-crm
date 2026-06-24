'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(fd: FormData) {
  const password = fd.get('password') as string
  if (password !== process.env.APP_PASSWORD) {
    return { error: 'Incorrect password' }
  }
  const cookieStore = await cookies()
  cookieStore.set('app_auth', process.env.APP_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('app_auth')
  redirect('/login')
}
