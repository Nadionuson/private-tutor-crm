import { getStudentWithStats } from '@/lib/queries/students'
import { notFound } from 'next/navigation'
import { LessonsTab } from './tabs/lessons-tab'
import { PaymentsTab } from './tabs/payments-tab'
import { InfoTab } from './tabs/info-tab'
import { ProfileHeader } from './profile-header'
import { StatBar } from './stat-bar'
import { TabNav } from './tab-nav'
import { ScheduleLessonDialog } from '@/components/lessons/schedule-lesson-dialog'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function StudentProfilePage({ params, searchParams }: Props) {
  const { id } = await params
  const { tab = 'lessons' } = await searchParams

  let student
  try {
    student = await getStudentWithStats(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <div className="bg-white border-b border-indigo-100 px-7 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">
            <a href="/students" className="text-indigo-500 hover:underline">Students</a>
            {' / '}
            {student.name}
          </div>
          <h1 className="text-lg font-bold text-indigo-950">{student.name}</h1>
        </div>
        <div className="flex gap-2">
          <ScheduleLessonDialog
            studentId={student.id}
            defaultRate={student.hourly_rate}
          />
        </div>
      </div>

      <div className="p-7">
        <ProfileHeader student={student} />
        <StatBar student={student} />
        <TabNav studentId={id} active={tab} />

        {tab === 'lessons' && <LessonsTab student={student} />}
        {tab === 'payments' && <PaymentsTab student={student} />}
        {tab === 'info' && <InfoTab student={student} />}
      </div>
    </div>
  )
}
