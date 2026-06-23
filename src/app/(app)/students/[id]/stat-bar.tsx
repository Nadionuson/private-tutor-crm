import { StudentWithStats } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export function StatBar({ student }: { student: StudentWithStats }) {
  const agingColor = !student.avg_payment_aging ? 'text-gray-500'
    : student.avg_payment_aging > 14 ? 'text-red-500'
    : student.avg_payment_aging > 7 ? 'text-amber-500'
    : 'text-green-600'

  const stats = [
    { label: 'Outstanding', value: formatCurrency(Math.max(0, student.balance)), className: student.balance > 0 ? 'text-red-500' : 'text-green-600', sub: student.balance > 0 ? 'needs payment' : 'all clear' },
    { label: 'Total paid', value: formatCurrency(student.total_paid), className: 'text-green-600', sub: 'all time' },
    { label: 'Lessons', value: student.lesson_count.toString(), className: '', sub: 'completed' },
    { label: 'Last lesson', value: formatDate(student.last_lesson), className: 'text-[13px]', sub: student.last_lesson ? `${Math.round((Date.now() - new Date(student.last_lesson).getTime()) / 86400000)} days ago` : '' },
    { label: 'Next lesson', value: formatDate(student.next_lesson), className: 'text-[13px] text-indigo-600', sub: student.next_lesson ? new Date(student.next_lesson).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'not scheduled' },
    { label: 'Avg aging', value: student.avg_payment_aging ? `${student.avg_payment_aging}d` : '—', className: agingColor, sub: 'payment speed' },
  ]

  return (
    <div className="grid grid-cols-6 bg-white border border-indigo-100 rounded-xl overflow-hidden mb-4">
      {stats.map((s, i) => (
        <div key={s.label} className={`px-4 py-3.5 ${i < stats.length - 1 ? 'border-r border-indigo-50' : ''}`}>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{s.label}</div>
          <div className={`text-base font-bold text-indigo-950 ${s.className}`}>{s.value}</div>
          {s.sub && <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>}
        </div>
      ))}
    </div>
  )
}
