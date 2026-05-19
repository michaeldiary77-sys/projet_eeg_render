'use client'

export default function EegContentArea({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      className="ml-64 mt-16 p-8 min-h-screen"
      style={{ backgroundColor: 'var(--color-surface-container-low)' }}
    >
      {children}
    </main>
  )
}
