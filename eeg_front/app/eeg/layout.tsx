import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import EegContentArea from '@/components/layout/EegContentArea'

export default function EegLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
      <Sidebar />
      <Topbar />
      <EegContentArea>
        {children}
      </EegContentArea>
    </div>
  )
}
