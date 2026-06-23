import { getStudentsWithStats } from '@/lib/queries/students'
import { getAllPaymentsWithStudents } from '@/lib/queries/payments'
import { formatCurrency, formatDate, getInitials, avatarColor } from '@/lib/utils'
import Link from 'next/link'

export default async function PaymentsPage() {
  const [students, allPayments] = await Promise.all([
    getStudentsWithStats(),
    getAllPaymentsWithStudents(),
  ])

  const totalOutstanding = students.reduce((s, st) => s + Math.max(0, st.balance), 0)
  const totalCollected = students.reduce((s, st) => s + st.total_paid, 0)
  const agingValues = students.map(s => s.avg_payment_aging).filter((v): v is number => v !== null)
  const avgAging = agingValues.length ? Math.round(agingValues.reduce((a, b) => a + b, 0) / agingValues.length) : 0

  const ranked = [...students]
    .filter(s => s.balance > 0 || s.lesson_count > 0)
    .sort((a, b) => b.balance - a.balance)

  return (
    <div>
      <div className="bg-white border-b border-indigo-100 px-7 py-4">
        <h1 className="text-lg font-bold text-indigo-950">Payments</h1>
        <p className="text-xs text-gray-400">Outstanding balances and payment history</p>
      </div>

      <div className="p-7">
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-3.5 mb-6">
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Total outstanding</div>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalOutstanding)}</div>
            <div className="text-xs text-gray-400 mt-1">{students.filter(s => s.balance > 0).length} students owe</div>
          </div>
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Total collected</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
            <div className="text-xs text-gray-400 mt-1">all time</div>
          </div>
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Avg payment aging</div>
            <div className="text-2xl font-bold text-indigo-950">{avgAging} days</div>
            <div className="text-xs text-gray-400 mt-1">avg days to pay</div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-5">
          {/* Student ranking */}
          <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-indigo-50">
              <span className="text-sm font-bold text-indigo-950">Students by balance</span>
            </div>
            {ranked.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No data yet</div>
            )}
            {ranked.map(student => (
              <Link key={student.id} href={`/students/${student.id}?tab=payments`}>
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-indigo-50 last:border-0 hover:bg-indigo-50/30 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: avatarColor(student.name) }}
                  >
                    {getInitials(student.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-indigo-950">{student.name}</div>
                    <div className="text-xs text-gray-400">{student.lesson_count} lessons · Total paid: {formatCurrency(student.total_paid)}</div>
                  </div>
                  <div className={`text-sm font-bold ${student.balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {student.balance > 0 ? formatCurrency(student.balance) : '✓ Paid'}
                  </div>
                  {student.avg_payment_aging && (
                    <div className={`text-xs px-2 py-0.5 rounded ${student.avg_payment_aging > 14 ? 'bg-red-50 text-red-500' : student.avg_payment_aging > 7 ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-600'}`}>
                      {student.avg_payment_aging}d avg
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Payment history */}
          <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-indigo-50">
              <span className="text-sm font-bold text-indigo-950">Payment history</span>
            </div>
            {allPayments.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No payments yet</div>
            )}
            {allPayments.map(p => {
              const student = (p as any).students
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3 border-b border-indigo-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-indigo-950 truncate">{student?.name}</div>
                    <div className="text-[10px] text-gray-400">{formatDate(p.paid_at)}</div>
                  </div>
                  <div className="text-sm font-bold text-indigo-950">{formatCurrency(Number(p.amount))}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
