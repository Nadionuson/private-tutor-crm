import { StudentWithStats } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export function StatBar({ student }: { student: StudentWithStats }) {
  const agingColor = !student.avg_payment_aging ? 'text-gray-500'
    : student.avg_payment_aging > 14 ? 'text-red-500'
    : student.avg_payment_aging > 7 ? 'text-amber-500'
    : 'text-green-600'

  const stats = [
    { label: 'Outstanding', value: formatCurrency(Math.max(0, student.balance)), className: student.balance > 0 ? 'text-red-500' : 'text-green-600', sub: student.balance > 0 ? 'por pagar' : 'em dia' },
    { label: 'Total paid', value: formatCurrency(student.total_paid), className: 'text-green-600', sub: 'total' },
    { label: 'Lessons', value: student.lesson_count.toString(), className: '', sub: 'concluídas' },
    { label: 'Last lesson', value: formatDate(student.last_lesson), className: 'text-[13px]', sub: student.last_lesson ? `${Math.round((Date.now() - new Date(student.last_lesson).getTime()) / 86400000)} dias atrás` : '' },
    { label: 'Next lesson', value: formatDate(student.next_lesson), className: 'text-[13px] text-indigo-600', sub: student.next_lesson ? new Date(student.next_lesson).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : 'não agendado' },
    { label: 'Avg aging', value: student.avg_payment_aging ? `${student.avg_payment_aging}d` : '—', className: agingColor, sub: 'prazo médio' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white border border-indigo-100 rounded-xl overflow-hidden mb-4">
      {stats.map((s, i) => (
        <div key={s.label} className={`px-3 py-3 md:px-4 md:py-3.5 border-b md:border-b-0 border-indigo-50 ${i % 2 === 0 ? 'border-r border-indigo-50' : ''} md:border-r md:[&:nth-child(3n)]:border-r-0 lg:border-r lg:[&:nth-child(6n)]:border-r-0`}>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{s.label}</div>
          <div className={`text-base font-bold text-indigo-950 ${s.className}`}>{s.value}</div>
          {s.sub && <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>}
        </div>
      ))}
    </div>
  )
}
