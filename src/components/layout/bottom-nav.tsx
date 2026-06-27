'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/students', label: 'Students', icon: '👥' },
  { href: '/calendar', label: 'Calendário', icon: '📅' },
  { href: '/payments', label: 'Pagamentos', icon: '💶' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden bg-white border-t border-indigo-100 pb-4">
      {TABS.map(tab => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1 text-[10px] font-medium transition-colors',
              active ? 'text-indigo-600' : 'text-gray-400'
            )}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
