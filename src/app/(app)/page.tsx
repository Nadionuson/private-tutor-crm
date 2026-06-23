import { getStudentsWithStats } from '@/lib/queries/students'
import { getUpcomingLessons } from '@/lib/queries/lessons'
import { getRecentPayments } from '@/lib/queries/payments'
import { formatCurrency, formatDateTime, getInitials, avatarColor } from '@/lib/utils'
import { startOfWeek, endOfWeek } from 'date-fns'
import Link from 'next/link'

export default async function DashboardPage() {
  const [students, upcoming, recentPayments] = await Promise.all([
    getStudentsWithStats(),
    getUpcomingLessons(8),
    getRecentPayments(6),
  ])

  const totalOutstanding = students.reduce((s, st) => s + Math.max(0, st.balance), 0)
  const totalCollected = students.reduce((s, st) => s + st.total_paid, 0)
  const agingValues = students.map(s => s.avg_payment_aging).filter((v): v is number => v !== null)
  const avgAging = agingValues.length ? Math.round(agingValues.reduce((a, b) => a + b, 0) / agingValues.length) : 0

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const lessonsThisWeek = students.flatMap(s => s.lessons).filter(l => {
    const d = new Date(l.scheduled_at)
    return l.status !== 'cancelled' && d >= weekStart && d <= weekEnd
  }).length

  const today = new Date().toDateString()

  return (
    <div>
      <div className="bg-white border-b border-indigo-100 px-7 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-indigo-950">Dashboard</h1>
          <p className="text-xs text-gray-400">{now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link href="/calendar">
          <button className="text-sm font-semibold text-white px-4 py-2 rounded-lg" style={{ background: '#6366f1' }}>
            + Schedule lesson
          </button>
        </Link>
      </div>

      <div className="p-7">
        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-3.5 mb-6">
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Outstanding</div>
            <div className="text-xl font-bold text-red-500">{formatCurrency(totalOutstanding)}</div>
            <div className="text-xs text-gray-400 mt-1">
              {students.filter(s => s.balance > 0).length} student{students.filter(s => s.balance > 0).length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Total collected</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
            <div className="text-xs text-gray-400 mt-1">all time</div>
          </div>
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Avg payment aging</div>
            <div className="text-xl font-bold text-indigo-950">{avgAging} days</div>
            <div className="text-xs text-gray-400 mt-1">last 90 days</div>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#6366f1' }}>
            <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: '#c7d2fe' }}>This week</div>
            <div className="text-xl font-bold text-white">{lessonsThisWeek} lessons</div>
            <div className="text-xs mt-1" style={{ color: '#a5b4fc' }}>
              {upcoming.filter(l => new Date(l.scheduled_at).toDateString() === today).length} today
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          {/* Upcoming lessons */}
          <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-indigo-50 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-950">Upcoming lessons</span>
              <Link href="/calendar" className="text-xs text-indigo-500">Open calendar →</Link>
            </div>
            {upcoming.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No upcoming lessons</div>
            )}
            {upcoming.map(lesson => {
              const isToday = new Date(lesson.scheduled_at).toDateString() === today
              const student = (lesson as any).students
              const cost = (lesson.duration_minutes / 60) * lesson.rate_at_time
              return (
                <div
                  key={lesson.id}
                  className={`grid grid-cols-[36px_1fr_72px_80px_52px] items-center gap-2.5 px-5 py-3 border-b border-indigo-50 last:border-0 text-sm ${isToday ? 'bg-indigo-50/40' : ''}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: avatarColor(student?.name ?? '') }}
                  >
                    {getInitials(student?.name ?? '?')}
                  </div>
                  <div>
                    <div className="font-semibold text-indigo-950 text-xs">{student?.name}</div>
                    <div className="text-xs text-gray-400">{formatDateTime(lesson.scheduled_at)} · {lesson.duration_minutes} min</div>
                  </div>
                  <div className="text-xs text-gray-500 bg-indigo-50 rounded px-2 py-0.5 text-center">{student?.grade}</div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded text-center ${isToday ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-50 text-amber-600'}`}>
                    {isToday ? 'Today' : 'Scheduled'}
                  </div>
                  <div className="text-xs text-gray-400 text-right">{formatCurrency(cost)}</div>
                </div>
              )
            })}
          </div>

          {/* Recent payments */}
          <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-indigo-50 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-950">Recent payments</span>
              <Link href="/payments" className="text-xs text-indigo-500">All →</Link>
            </div>
            {recentPayments.map(p => {
              const student = (p as any).students
              return (
                <div key={p.id} className="flex items-center gap-2.5 px-5 py-3 border-b border-indigo-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <div className="flex-1 text-xs font-semibold text-indigo-950 truncate">{student?.name}</div>
                  <div className="text-xs text-gray-400">{p.paid_at}</div>
                  <div className="text-xs font-bold text-indigo-950">{formatCurrency(Number(p.amount))}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
