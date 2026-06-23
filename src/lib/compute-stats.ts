import { Student, LessonWithNotes, Payment, StudentWithStats } from './types'

interface RawStudent extends Student {
  lessons: LessonWithNotes[]
  payments: Payment[]
}

export function computeStats(student: RawStudent): StudentWithStats {
  const completed = student.lessons.filter(l => l.status === 'completed')
  const scheduled = student.lessons.filter(l => l.status === 'scheduled')

  const accrued = completed.reduce(
    (sum, l) => sum + (l.duration_minutes / 60) * Number(l.rate_at_time),
    0
  )

  const total_paid = student.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  )

  const balance = accrued - total_paid
  const lesson_count = completed.length

  const sortedCompleted = [...completed].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  )
  const sortedScheduled = [...scheduled].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  )

  const last_lesson = sortedCompleted[0]?.scheduled_at ?? null
  const next_lesson = sortedScheduled.find(
    l => new Date(l.scheduled_at) > new Date()
  )?.scheduled_at ?? null

  // FIFO approximation: match completed lessons to payments chronologically
  const lessonDates = [...completed]
    .map(l => new Date(l.scheduled_at).getTime())
    .sort((a, b) => a - b)

  const paymentDates = [...student.payments]
    .map(p => new Date(p.paid_at).getTime())
    .sort((a, b) => a - b)

  let avg_payment_aging: number | null = null
  if (lessonDates.length > 0 && paymentDates.length > 0) {
    const gaps: number[] = []
    let payIdx = 0
    for (const lessonDate of lessonDates) {
      while (payIdx < paymentDates.length && paymentDates[payIdx] < lessonDate) payIdx++
      if (payIdx < paymentDates.length) {
        gaps.push((paymentDates[payIdx] - lessonDate) / (1000 * 60 * 60 * 24))
        payIdx++
      }
    }
    if (gaps.length > 0) {
      avg_payment_aging = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
    }
  }

  return {
    ...student,
    accrued,
    total_paid,
    balance,
    lesson_count,
    last_lesson,
    next_lesson,
    avg_payment_aging,
  }
}
