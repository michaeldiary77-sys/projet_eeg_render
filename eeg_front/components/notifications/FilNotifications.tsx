'use client'

import NotificationCard from './NotificationCard'
import type { Notification } from '@/types/eeg/notification'

interface FilNotificationsProps {
  notifications: Notification[]
  onRefresh: () => void
}

const ORDRE_NIVEAU: Record<string, number> = {
  STAT: 0,
  URGENTE: 1,
  NORMALE: 2,
}

const SEPARATEUR_LABEL: Record<string, string> = {
  STAT: '🔴 Critiques',
  URGENTE: '🟠 Urgentes',
  NORMALE: '🔵 Informations',
}

export default function FilNotifications({ notifications, onRefresh }: FilNotificationsProps) {
  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-4xl mb-3">🔔</p>
        <p className="text-gray-500 font-medium">Aucune notification</p>
        <p className="text-gray-400 text-sm mt-1">Vous êtes à jour !</p>
      </div>
    )
  }

  // Trier par niveau puis par horodatage décroissant
  const triees = [...notifications].sort((a, b) => {
    const niveauDiff = ORDRE_NIVEAU[a.niveau] - ORDRE_NIVEAU[b.niveau]
    if (niveauDiff !== 0) return niveauDiff
    return new Date(b.horodatage).getTime() - new Date(a.horodatage).getTime()
  })

  // Grouper par niveau
  const groupes: Record<string, Notification[]> = {}
  triees.forEach(n => {
    if (!groupes[n.niveau]) groupes[n.niveau] = []
    groupes[n.niveau].push(n)
  })

  return (
    <div className="space-y-6">
      {(['STAT', 'URGENTE', 'NORMALE'] as const).map(niveau => {
        const groupe = groupes[niveau]
        if (!groupe || groupe.length === 0) return null
        return (
          <div key={niveau}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {SEPARATEUR_LABEL[niveau]} — {groupe.length}
            </p>
            <ul className="space-y-2">
              {groupe.map(notif => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onLue={onRefresh}
                />
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
