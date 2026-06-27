'use client'
import { StudentWithStats } from '@/lib/types'
import { getInitials, avatarColor } from '@/lib/utils'
import { ChangeRateDialog } from './change-rate-dialog'

export function ProfileHeader({ student }: { student: StudentWithStats }) {
  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {student.avatar_url ? (
            <img src={student.avatar_url} alt={student.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover" />
          ) : (
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white"
              style={{ background: avatarColor(student.name) }}
            >
              {getInitials(student.name)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="text-base md:text-lg font-bold text-indigo-950">{student.name}</div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-400">€/hr</div>
              <div className="text-lg font-bold text-indigo-950">
                {Number(student.hourly_rate).toFixed(2)}
              </div>
              <ChangeRateDialog studentId={student.id} currentRate={student.hourly_rate} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 flex-wrap">
            <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded">{student.grade} grade</span>
            <span>Idade {student.age}</span>
            <span>·</span>
            <span>{student.parent_name}</span>
            {student.parent_email && (
              <>
                <span className="hidden sm:inline">·</span>
                <a href={`mailto:${student.parent_email}`} className="hidden sm:inline text-indigo-500 hover:underline">{student.parent_email}</a>
              </>
            )}
            {student.parent_phone && (
              <>
                <span>·</span>
                <span>{student.parent_phone}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
