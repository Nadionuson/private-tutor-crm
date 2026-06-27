import Link from 'next/link'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'lessons', label: 'Lessons' },
  { key: 'payments', label: 'Payments' },
  { key: 'info', label: 'Info' },
]

export function TabNav({ studentId, active }: { studentId: string; active: string }) {
  return (
    <div className="flex gap-1 bg-white border border-indigo-100 rounded-xl p-1.5 w-full md:w-fit mb-4">
      {TABS.map(tab => (
        <Link
          key={tab.key}
          href={`/students/${studentId}?tab=${tab.key}`}
          className={cn(
            'flex-1 md:flex-none text-center px-4 md:px-5 py-1.5 rounded-lg text-sm font-medium transition-colors',
            active === tab.key
              ? 'text-white'
              : 'text-gray-500 hover:bg-gray-50'
          )}
          style={active === tab.key ? { background: '#6366f1' } : {}}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
