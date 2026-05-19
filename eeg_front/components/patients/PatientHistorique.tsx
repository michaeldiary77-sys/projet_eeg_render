'use client'

import { useRouter } from 'next/navigation'
import type { DemandeEEG } from '@/types/eeg/demande'

interface PatientHistoriqueProps {
  demandes: DemandeEEG[]
}

const STATUT_BADGE: Record<string, string> = {
  CREEE: 'bg-gray-100 text-gray-600',
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  RESULTAT_DISPONIBLE: 'bg-emerald-100 text-emerald-700',
  ACK_RECU: 'bg-violet-100 text-violet-700',
  ANNULEE: 'bg-gray-100 text-gray-400',
}

const URGENCE_BADGE: Record<string, string> = {
  STAT: 'bg-red-100 text-red-700',
  URGENTE: 'bg-orange-100 text-orange-700',
  NORMALE: 'bg-violet-100 text-violet-700',
}

const URGENCE_BARRE: Record<string, string> = {
  STAT: 'bg-red-500',
  URGENTE: 'bg-orange-400',
  NORMALE: 'bg-violet-400',
}

export default function PatientHistorique({ demandes }: PatientHistoriqueProps) {
  const router = useRouter()

  if (demandes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-3xl mb-2">📋</p>
        <p className="text-gray-500 text-sm">Aucun antécédent EEG</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">
          🕒 Historique des demandes EEG
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({demandes.length} demande{demandes.length > 1 ? 's' : ''})
          </span>
        </h3>
      </div>

      <ul className="divide-y divide-gray-50">
        {demandes.map(demande => (
          <li
            key={demande.id}
            onClick={() => router.push(`/eeg/worklist/${demande.id}`)}
            className="flex gap-0 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-1 shrink-0 ${URGENCE_BARRE[demande.urgence]}`} />
            <div className="px-5 py-4 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono text-sm font-semibold text-gray-700">
                  {demande.numeroEEG}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${URGENCE_BADGE[demande.urgence]}`}>
                    {demande.urgence}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_BADGE[demande.statut]}`}>
                    {demande.statut}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-xs text-gray-500">{demande.typeEEG}</span>
                <span className="text-xs text-gray-400">
                  📅 {new Date(demande.dateCreation).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
                {demande.prescripteur && (
                  <span className="text-xs text-gray-400">
                    👨‍⚕️ Dr. {demande.prescripteur.nom}
                  </span>
                )}
              </div>

              {demande.motifPrescription && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {demande.motifPrescription}
                </p>
              )}
            </div>
            <div className="flex items-center pr-4 text-gray-300">›</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
