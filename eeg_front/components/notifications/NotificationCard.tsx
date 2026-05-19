'use client'

import { useRouter } from 'next/navigation'
import { marquerCommeLue } from '@/services/notifications.service'
import type { Notification } from '@/types/eeg/notification'

interface NotificationCardProps {
  notification: Notification
  onLue: () => void
}

const NIVEAU_BARRE: Record<string, string> = {
  STAT: 'bg-red-500',
  URGENTE: 'bg-orange-400',
  NORMALE: 'bg-violet-400',
}

const NIVEAU_BADGE: Record<string, string> = {
  STAT: 'bg-red-100 text-red-700 border border-red-300',
  URGENTE: 'bg-orange-100 text-orange-700 border border-orange-300',
  NORMALE: 'bg-violet-100 text-violet-700 border border-violet-200',
}

const TYPE_ICONE: Record<string, string> = {
  ALERTE_CRITIQUE: '🚨',
  ALERTE_URGENTE: '⚠️',
  RAPPORT: '📊',
  SYSTEME: '⚙️',
}

function horodatageRelatif(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  const heures = Math.floor(minutes / 60)
  if (heures < 24) return `Il y a ${heures}h`
  return `Il y a ${Math.floor(heures / 24)}j`
}

export default function NotificationCard({ notification, onLue }: NotificationCardProps) {
  const router = useRouter()

  const handleClick = async () => {
    if (!notification.lu) {
      try {
        await marquerCommeLue(notification.id)
        onLue()
      } catch {}
    }
    if (notification.demandeId) {
      router.push(`/eeg/worklist/${notification.demandeId}`)
    }
  }

  return (
    <li
      onClick={handleClick}
      className={`flex gap-0 rounded-xl overflow-hidden border transition-all cursor-pointer ${
        notification.lu
          ? 'border-gray-100 bg-white opacity-70 hover:opacity-100'
          : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      {/* Barre couleur gauche */}
      <div className={`w-1 shrink-0 ${NIVEAU_BARRE[notification.niveau]}`} />

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{TYPE_ICONE[notification.type]}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${NIVEAU_BADGE[notification.niveau]}`}>
              {notification.niveau}
            </span>
            {!notification.lu && (
              <span className="w-2 h-2 rounded-full bg-[#6750a4] shrink-0" />
            )}
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {horodatageRelatif(notification.horodatage)}
          </span>
        </div>

        <p className="text-sm font-semibold text-gray-800 mt-2">{notification.titre}</p>

        <p className="text-sm text-gray-600 mt-0.5">
          {notification.patientTexte ? (
            <>
              <span className="font-medium text-gray-800">{notification.patientTexte}</span>
              {' — '}
            </>
          ) : null}
          {notification.message}
        </p>

        {/* Boutons action */}
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
            {notification.actions
              .sort((a, b) => a.ordre - b.ordre)
              .map(action => (
                <button
                  key={action.id}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    action.style === 'primary'
                      ? 'bg-[#6750a4] text-white hover:bg-[#5a4490]'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {action.label}
                </button>
              ))}
          </div>
        )}

        {notification.demandeId && (
          <p className="text-xs text-[#6750a4] mt-2">→ Voir la demande</p>
        )}
      </div>
    </li>
  )
}
