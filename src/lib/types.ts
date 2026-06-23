export type LessonStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Student {
  id: string
  name: string
  age: number
  grade: string
  parent_name: string
  parent_email: string
  parent_phone: string
  hourly_rate: number
  start_date: string
  avatar_url: string | null
  created_at: string
}

export interface StudentWithStats extends Student {
  total_paid: number
  accrued: number
  balance: number
  lesson_count: number
  last_lesson: string | null
  next_lesson: string | null
  avg_payment_aging: number | null
  lessons: LessonWithNotes[]
  payments: Payment[]
}

export interface Lesson {
  id: string
  student_id: string
  scheduled_at: string
  duration_minutes: number
  rate_at_time: number
  status: LessonStatus
  created_at: string
}

export interface LessonNotes {
  id: string
  lesson_id: string
  topic: string
  prep_notes: string
  outcome_notes: string
  created_at: string
}

export interface LessonWithNotes extends Lesson {
  lesson_notes: LessonNotes | null
}

export interface Payment {
  id: string
  student_id: string
  amount: number
  paid_at: string
  notes: string | null
  created_at: string
}

export interface AllowedEmail {
  id: string
  email: string
  added_at: string
  added_by: string
}

export interface DashboardStats {
  total_outstanding: number
  total_collected: number
  avg_payment_aging: number
  lessons_this_week: number
  upcoming_lessons: (LessonWithNotes & { student: Student })[]
  recent_payments: (Payment & { student: Student })[]
}
