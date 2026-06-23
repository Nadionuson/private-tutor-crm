import { getLessonsWithStudent } from '@/lib/queries/lessons'
import { getStudentsWithStats } from '@/lib/queries/students'
import { LessonCalendar } from '@/components/calendar/lesson-calendar'
import { subMonths, addMonths } from 'date-fns'

export default async function CalendarPage() {
  const now = new Date()
  const [lessons, students] = await Promise.all([
    getLessonsWithStudent(subMonths(now, 2), addMonths(now, 3)),
    getStudentsWithStats(),
  ])

  return (
    <div>
      <div className="bg-white border-b border-indigo-100 px-7 py-4">
        <h1 className="text-lg font-bold text-indigo-950">Calendar</h1>
        <p className="text-xs text-gray-400">Click an empty slot to schedule a lesson</p>
      </div>
      <div className="p-7">
        <LessonCalendar lessons={lessons as any} students={students} />
      </div>
    </div>
  )
}
