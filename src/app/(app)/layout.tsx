import { Sidebar } from '@/components/layout/sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#f1f0f8' }}>
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
