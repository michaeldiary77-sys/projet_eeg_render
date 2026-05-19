'use client'

import { useRouter } from 'next/navigation'
import type { Notification } from '@/types/eeg/notification'

interface AlertesActivesProps {
  alertes: Notification[]
}

const NIVEAU_STYLES = {
  STAT: 'bg-red-100 text-red-700 border-red-300',
  URGENTE: 'bg-orange-100 text-orange-700 border-orange-300',
  NORMALE: 'bg-violet-100 text-violet-700 border-violet-300',
}

const BARRE_STYLES = {
  STAT: 'bg-red-500',
  URGENTE: 'bg-orange-400',
  NORMALE: 'bg-violet-400',
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

export default function AlertesActives({ alertes }: AlertesActivesProps) {
  const router = useRouter()

  const alertesFiltrees = alertes
    .filter(a => a.niveau === 'STAT' || a.niveau === 'URGENTE')
    .slice(0, 5)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">🚨 Alertes actives</h2>
        <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
          {alertesFiltrees.length}
        </span>
      </div>

      {alertesFiltrees.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-400 text-sm">
          Aucune alerte active
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {alertesFiltrees.map(alerte => (
            <li
              key={alerte.id}
              onClick={() => alerte.demandeId && router.push(`/eeg/worklist/${alerte.demandeId}`)}
              className={`flex gap-0 cursor-pointer hover:bg-gray-50 transition-colors ${alerte.demandeId ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`w-1 shrink-0 ${BARRE_STYLES[alerte.niveau]}`} />
              <div className="px-4 py-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${NIVEAU_STYLES[alerte.niveau]}`}>
                    {alerte.niveau}
                  </span>
                  <span className="text-xs text-gray-400">{horodatageRelatif(alerte.horodatage)}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{alerte.titre}</p>
                {alerte.patientTexte && (
                  <p className="text-xs text-gray-500 truncate">👤 {alerte.patientTexte}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
