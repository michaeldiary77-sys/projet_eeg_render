'use client'

interface KpiCardProps {
  label: string
  value: number | string
  icon: string
  variant?: 'primary' | 'warning' | 'success' | 'secondary'
  secondaryInfo?: string
}

const VARIANT_STYLES = {
  primary: {
    bg: 'bg-[#eaddff]',
    text: 'text-[#6750a4]',
    icon: 'bg-[#6750a4]',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: 'bg-amber-500',
  },
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: 'bg-emerald-500',
  },
  secondary: {
    bg: 'bg-[#e8def8]',
    text: 'text-[#625b71]',
    icon: 'bg-[#625b71]',
  },
}

export default function KpiCard({
  label,
  value,
  icon,
  variant = 'primary',
  secondaryInfo,
}: KpiCardProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${styles.icon} flex items-center justify-center text-white text-xl shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
        {secondaryInfo && (
          <p className="text-xs text-gray-400 mt-0.5">{secondaryInfo}</p>
        )}
      </div>
    </div>
  )
}
