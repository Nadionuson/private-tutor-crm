'use client'
import { StudentWithStats } from '@/lib/types'
import { getInitials, avatarColor } from '@/lib/utils'
import { ChangeRateDialog } from './change-rate-dialog'

export function ProfileHeader({ student }: { student: StudentWithStats }) {
  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-5 mb-4 grid grid-cols-[auto_1fr_auto] gap-5 items-center">
      <div className="relative">
        {student.avatar_url ? (
          <img src={student.avatar_url} alt={student.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: avatarColor(student.name) }}
          >
            {getInitials(student.name)}
          </div>
        )}
      </div>
      <div>
        <div className="text-lg font-bold text-indigo-950">{student.name}</div>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 flex-wrap">
          <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded">{student.grade} grade</span>
          <span>Age {student.age}</span>
          <span>·</span>
          <span>{student.parent_name}</span>
          <span>·</span>
          <a href={`mailto:${student.parent_email}`} className="text-indigo-500 hover:underline text-xs">{student.parent_email}</a>
          <span>·</span>
          <span className="text-xs">{student.parent_phone}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400 mb-1">Hourly rate</div>
        <div className="text-xl font-bold text-indigo-950">
          €{Number(student.hourly_rate).toFixed(2)}<span className="text-sm font-normal text-gray-400">/hr</span>
        </div>
        <ChangeRateDialog studentId={student.id} currentRate={student.hourly_rate} />
      </div>
    </div>
  )
}
