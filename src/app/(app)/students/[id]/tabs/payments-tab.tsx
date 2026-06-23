import { StudentWithStats } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LogPaymentDialog } from '@/components/payments/log-payment-dialog'

export function PaymentsTab({ student }: { student: StudentWithStats }) {
  const sorted = [...student.payments].sort(
    (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
  )

  return (
    <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-indigo-50 flex items-center justify-between">
        <span className="text-sm font-bold text-indigo-950">Payment history</span>
        <LogPaymentDialog studentId={student.id} currentBalance={Math.max(0, student.balance)} />
      </div>

      {sorted.length === 0 && (
        <div className="px-5 py-10 text-center text-sm text-gray-400">No payments recorded yet.</div>
      )}

      {sorted.map(p => (
        <div key={p.id} className="flex items-center gap-3 px-5 py-3 border-b border-indigo-50 last:border-0">
          <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-indigo-950">{formatDate(p.paid_at)}</div>
            {p.notes && <div className="text-[10px] text-gray-400 mt-0.5">{p.notes}</div>}
          </div>
          <div className="text-sm font-bold text-indigo-950">{formatCurrency(Number(p.amount))}</div>
        </div>
      ))}

      {sorted.length > 0 && (
        <div className="px-5 py-3 bg-indigo-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-500">Total paid</span>
          <span className="text-sm font-bold text-green-600">{formatCurrency(student.total_paid)}</span>
        </div>
      )}
    </div>
  )
}
