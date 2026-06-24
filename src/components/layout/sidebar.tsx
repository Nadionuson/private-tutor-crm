'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logout } from '@/app/(auth)/login/actions'

const NAV = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/students', label: 'Students', icon: '👥' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/payments', label: 'Payments', icon: '💶' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] min-w-[220px] bg-white border-r border-indigo-100 flex flex-col h-screen sticky top-0">
      <div className="px-4 py-5 flex items-center gap-3 border-b border-indigo-50">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base"
          style={{ background: '#6366f1', fontFamily: 'Georgia, serif' }}
        >
          ∑
        </div>
        <div>
          <div className="text-sm font-bold text-indigo-950">MathTutor</div>
          <div className="text-xs text-gray-400">Private lessons CRM</div>
        </div>
      </div>

      <nav className="flex-1 p-2.5 space-y-0.5">
        {NAV.map(item => {
          const active = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              <span className="w-4 text-center text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        <div className="border-t border-indigo-50 pt-2 mt-2">
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === '/admin'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-gray-400 hover:bg-gray-50'
            )}
          >
            <span className="w-4 text-center text-base">⚙️</span>
            Admin
          </Link>
        </div>
      </nav>

      <div className="px-3.5 py-3 border-t border-indigo-50">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span>↩</span> Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
