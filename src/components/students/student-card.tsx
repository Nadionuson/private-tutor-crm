import Link from 'next/link'
import { StudentWithStats } from '@/lib/types'
import { formatCurrency, formatDate, getInitials, avatarColor } from '@/lib/utils'

export function StudentCard({ student }: { student: StudentWithStats }) {
  const hasBalance = student.balance > 0
  const agingColor = !student.avg_payment_aging ? 'text-gray-400'
    : student.avg_payment_aging > 14 ? 'text-red-500'
    : student.avg_payment_aging > 7 ? 'text-amber-500'
    : 'text-green-600'

  return (
    <Link href={`/students/${student.id}`}>
      <div className="bg-white border border-indigo-100 rounded-xl p-4.5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all relative group">
        {hasBalance && (
          <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-red-400" />
        )}

        <div className="flex items-start gap-3 mb-3.5">
          {student.avatar_url ? (
            <img
              src={student.avatar_url}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ background: avatarColor(student.name) }}
            >
              {getInitials(student.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-indigo-950 text-sm truncate">{student.name}</div>
            <div className="text-xs text-gray-400">{student.grade} grade · age {student.age}</div>
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded ${hasBalance ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
            {hasBalance ? formatCurrency(student.balance) : '✓ Paid'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3.5">
          {[
            { label: 'Lessons', value: student.lesson_count },
            { label: 'Total paid', value: formatCurrency(student.total_paid) },
            { label: 'Last lesson', value: formatDate(student.last_lesson) },
            { label: 'Avg aging', value: student.avg_payment_aging ? `${student.avg_payment_aging}d` : '—', className: agingColor },
          ].map(stat => (
            <div key={stat.label} className="bg-indigo-50/50 rounded-lg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">{stat.label}</div>
              <div className={`text-sm font-semibold text-indigo-950 ${stat.className ?? ''}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-indigo-50">
          <div className="text-xs text-gray-500">
            Next: {' '}
            <span className="text-indigo-600 font-semibold">
              {student.next_lesson ? formatDate(student.next_lesson) : 'Not scheduled'}
            </span>
          </div>
          <span className="text-indigo-200 group-hover:text-indigo-400 transition-colors">→</span>
        </div>
      </div>
    </Link>
  )
}
