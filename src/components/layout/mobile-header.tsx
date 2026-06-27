'use client'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/students': 'Alunos',
  '/calendar': 'Calendário',
  '/payments': 'Pagamentos',
  '/admin': 'Admin',
}

export function MobileHeader() {
  const pathname = usePathname()
  const title = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname.startsWith(path + '/'))
    ?.[1] ?? 'MathTutor'

  return (
    <header className="flex md:hidden items-center gap-3 px-4 h-14 bg-white border-b border-indigo-100 sticky top-0 z-30">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ background: '#6366f1', fontFamily: 'Georgia, serif' }}
      >
        ∑
      </div>
      <span className="text-base font-bold text-indigo-950">{title}</span>
    </header>
  )
}
