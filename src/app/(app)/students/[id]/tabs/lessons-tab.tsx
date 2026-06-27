'use client'
import { useState } from 'react'
import { StudentWithStats, LessonWithNotes } from '@/lib/types'
import { formatDateTime, formatCurrency, lessonCost } from '@/lib/utils'
import { MarkCompleteDialog } from '@/components/lessons/mark-complete-dialog'
import { LessonNotesDialog } from '@/components/lessons/lesson-notes-dialog'
import { cancelLesson } from '../actions'

export function LessonsTab({ student }: { student: StudentWithStats }) {
  const sorted = [...student.lessons]
    .filter(l => l.status !== 'cancelled')
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())

  return (
    <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-indigo-50 flex items-center justify-between">
        <span className="text-sm font-bold text-indigo-950">Lesson history</span>
        <span className="text-xs text-gray-400">
          {student.lesson_count} completed · {student.lessons.filter(l => l.status === 'scheduled').length} upcoming
        </span>
      </div>

      {sorted.length === 0 && (
        <div className="px-5 py-10 text-center text-sm text-gray-400">No lessons yet.</div>
      )}

      {sorted.map(lesson => (
        <LessonRow key={lesson.id} lesson={lesson} student={student} />
      ))}
    </div>
  )
}

function LessonRow({ lesson, student }: { lesson: LessonWithNotes; student: StudentWithStats }) {
  const [completeOpen, setCompleteOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const isUpcoming = lesson.status === 'scheduled'
  const cost = lessonCost(lesson.duration_minutes, lesson.rate_at_time)

  async function handleCancel() {
    setCancelling(true)
    try {
      await cancelLesson(lesson.id, student.id)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className={`px-4 md:px-5 py-3.5 border-b border-indigo-50 last:border-0 ${isUpcoming ? 'bg-indigo-50/30' : ''}`}>
      {/* Mobile layout */}
      <div className="flex items-start gap-3 md:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-indigo-950">{formatDateTime(lesson.scheduled_at)}</div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isUpcoming ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
              }`}>
                {isUpcoming ? 'Próxima' : 'Concluída'}
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-indigo-950">{formatCurrency(cost)}</div>
              <div className="text-[10px] text-gray-400">{lesson.duration_minutes} min</div>
            </div>
          </div>
          {lesson.lesson_notes?.topic ? (
            <div className="mt-1.5">
              <div className="text-xs text-indigo-950 font-semibold">{lesson.lesson_notes.topic}</div>
              {!isUpcoming && (
                <LessonNotesDialog lessonId={lesson.id} studentId={student.id} existing={lesson.lesson_notes} />
              )}
            </div>
          ) : (
            !isUpcoming && (
              <LessonNotesDialog lessonId={lesson.id} studentId={student.id} existing={lesson.lesson_notes} />
            )
          )}
          {isUpcoming && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setCompleteOpen(true)}
                className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg flex-1"
                style={{ background: '#6366f1' }}
              >
                Concluir
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs text-red-400 border border-red-100 px-3 py-1 rounded-lg hover:bg-red-50"
              >
                {cancelling ? '…' : 'Cancelar'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop layout — original grid */}
      <div className="hidden md:grid grid-cols-[90px_1fr_auto_auto] items-start gap-3">
        <div>
          <div className="text-xs font-semibold text-indigo-950">{formatDateTime(lesson.scheduled_at)}</div>
          <div className="mt-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isUpcoming ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
            }`}>
              {isUpcoming ? 'Próxima' : 'Concluída'}
            </span>
          </div>
        </div>

        <div>
          {lesson.lesson_notes?.topic ? (
            <div>
              <div className="text-xs font-semibold text-indigo-950 mb-1">{lesson.lesson_notes.topic}</div>
              <div className="flex gap-1.5 flex-wrap">
                {lesson.lesson_notes.prep_notes && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded">
                    Prep: {lesson.lesson_notes.prep_notes.slice(0, 40)}{lesson.lesson_notes.prep_notes.length > 40 ? '…' : ''}
                  </span>
                )}
                {lesson.lesson_notes.outcome_notes && (
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded">
                    Resultado: {lesson.lesson_notes.outcome_notes.slice(0, 40)}{lesson.lesson_notes.outcome_notes.length > 40 ? '…' : ''}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300 italic">Sem notas</span>
              {!isUpcoming && (
                <LessonNotesDialog lessonId={lesson.id} studentId={student.id} existing={lesson.lesson_notes} />
              )}
            </div>
          )}
          {lesson.lesson_notes?.topic && !isUpcoming && (
            <LessonNotesDialog lessonId={lesson.id} studentId={student.id} existing={lesson.lesson_notes} />
          )}
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-indigo-950">{formatCurrency(cost)}</div>
          <div className="text-[10px] text-gray-400">{lesson.duration_minutes} min</div>
        </div>

        {isUpcoming && (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setCompleteOpen(true)}
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
              style={{ background: '#6366f1' }}
            >
              Concluir
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-xs text-red-400 border border-red-100 px-3 py-1 rounded-lg hover:bg-red-50"
            >
              {cancelling ? '…' : 'Cancelar'}
            </button>
          </div>
        )}
        {!isUpcoming && <div />}
      </div>

      <MarkCompleteDialog
        lesson={lesson}
        studentId={student.id}
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
      />
    </div>
  )
}
