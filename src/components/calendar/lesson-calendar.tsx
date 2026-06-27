'use client'
import { useCallback, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt'
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core'
import { Student } from '@/lib/types'
import { ScheduleLessonFromCalendarDialog } from './schedule-from-calendar-dialog'
import { LessonEventDialog } from './lesson-event-dialog'

interface CalendarLesson {
  id: string
  student_id: string
  scheduled_at: string
  duration_minutes: number
  rate_at_time: number
  status: string
  students: { name: string; grade: string }
}

interface Props {
  lessons: CalendarLesson[]
  students: Student[]
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#f59e0b',
  completed: '#22c55e',
  cancelled: '#ef4444',
}

export function LessonCalendar({ lessons, students }: Props) {
  const [scheduleData, setScheduleData] = useState<{ start: string; end: string } | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<CalendarLesson | null>(null)

  const events = lessons.map(l => ({
    id: l.id,
    title: l.students?.name ?? 'Unknown',
    start: l.scheduled_at,
    end: new Date(new Date(l.scheduled_at).getTime() + l.duration_minutes * 60000).toISOString(),
    backgroundColor: STATUS_COLORS[l.status] ?? '#6366f1',
    borderColor: STATUS_COLORS[l.status] ?? '#6366f1',
    extendedProps: l,
  }))

  function handleDateSelect(info: DateSelectArg) {
    setScheduleData({ start: info.startStr, end: info.endStr })
  }

  function handleEventClick(info: EventClickArg) {
    setSelectedLesson(info.event.extendedProps as CalendarLesson)
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-indigo-100 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          locale={ptLocale}
          selectable
          selectMirror
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          firstDay={1}
          nowIndicator
        />
      </div>

      {scheduleData && (
        <ScheduleLessonFromCalendarDialog
          start={scheduleData.start}
          end={scheduleData.end}
          students={students}
          open
          onClose={() => setScheduleData(null)}
        />
      )}

      {selectedLesson && (
        <LessonEventDialog
          lesson={selectedLesson}
          open
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </>
  )
}
