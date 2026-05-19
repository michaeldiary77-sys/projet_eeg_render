'use client'

import type { EegAudit } from '@/types/eeg/audit'

interface DernieresActivitesProps {
  activites: EegAudit[]
}

const ACTION_ICONS: Record<string, string> = {
  CREATION: '➕',
  CONSULTATION: '👁️',
  MODIFICATION: '✏️',
  VALIDATION: '✅',
  ANNULATION: '❌',
  IMPRESSION: '🖨️',
  ACK: '📬',
}

const ACTION_COLORS: Record<string, string> = {
  CREATION: 'text-violet-600',
  CONSULTATION: 'text-blue-500',
  MODIFICATION: 'text-amber-600',
  VALIDATION: 'text-emerald-600',
  ANNULATION: 'text-red-500',
  IMPRESSION: 'text-gray-500',
  ACK: 'text-teal-600',
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

export default function DernieresActivites({ activites }: DernieresActivitesProps) {
  const cinqDernieres = activites.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">🕒 Dernières activités</h2>
      </div>

      {cinqDernieres.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-400 text-sm">
          Aucune activité récente
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {cinqDernieres.map(activite => (
            <li key={activite.id} className="px-6 py-3 flex items-start gap-3">
              <span className={`text-lg mt-0.5 ${ACTION_COLORS[activite.action]}`}>
                {ACTION_ICONS[activite.action]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{activite.action}</span>
                  {' — '}
                  <span className="text-gray-500">{activite.entite}</span>
                </p>
                <p className="text-xs text-gray-400">{horodatageRelatif(activite.dateAction)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
