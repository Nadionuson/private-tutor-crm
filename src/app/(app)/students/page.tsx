import { getStudentsWithStats } from '@/lib/queries/students'
import { StudentCard } from '@/components/students/student-card'
import { AddStudentDialog } from '@/components/students/add-student-dialog'

export default async function StudentsPage() {
  const students = await getStudentsWithStats()

  return (
    <div>
      <div className="bg-white border-b border-indigo-100 px-7 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-indigo-950">Students</h1>
          <p className="text-xs text-gray-400">{students.length} student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <AddStudentDialog />
      </div>

      <div className="p-7">
        {students.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-sm">No students yet. Add your first student to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {students.map(s => <StudentCard key={s.id} student={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
