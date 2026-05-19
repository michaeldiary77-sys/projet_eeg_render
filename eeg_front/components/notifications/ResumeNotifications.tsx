'use client'

import type { Notification } from '@/types/eeg/notification'

interface ResumeNotificationsProps {
  notifications: Notification[]
}

export default function ResumeNotifications({ notifications }: ResumeNotificationsProps) {
  const nonLues = notifications.filter(n => !n.lu)
  const stat = nonLues.filter(n => n.niveau === 'STAT').length
  const urgente = nonLues.filter(n => n.niveau === 'URGENTE').length
  const normale = nonLues.filter(n => n.niveau === 'NORMALE').length

  if (nonLues.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3">
      {stat > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-700">
            {stat} critique{stat > 1 ? 's' : ''}
          </span>
        </div>
      )}
      {urgente > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-sm font-semibold text-orange-700">
            {urgente} urgente{urgente > 1 ? 's' : ''}
          </span>
        </div>
      )}
      {normale > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-sm font-semibold text-violet-700">
            {normale} info{normale > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
