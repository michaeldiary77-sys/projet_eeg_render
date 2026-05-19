'use client'

import type { RendezVousEEG } from '@/types/eeg/rdv'

interface PlanningDuJourProps {
  rdvs: RendezVousEEG[]
}

const STATUT_STYLES: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  REALISE: 'bg-emerald-100 text-emerald-700',
  NON_REALISE: 'bg-red-100 text-red-700',
  ANNULE: 'bg-gray-100 text-gray-400',
}

const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  REALISE: 'Réalisé',
  NON_REALISE: 'Non réalisé',
  ANNULE: 'Annulé',
}

const PRIORITE_BARRE: Record<string, string> = {
  STAT: 'bg-red-500',
  URGENTE: 'bg-orange-400',
  NORMALE: 'bg-violet-400',
}

export default function PlanningDuJour({ rdvs }: PlanningDuJourProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">📅 Planning du jour</h2>
        <span className="text-xs bg-violet-100 text-violet-600 font-bold px-2 py-0.5 rounded-full">
          {rdvs.length} RDV
        </span>
      </div>

      {rdvs.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-400 text-sm">
          Aucun RDV aujourd'hui
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {rdvs.map(rdv => (
            <li key={rdv.id} className="flex gap-0">
              <div className={`w-1 shrink-0 ${PRIORITE_BARRE[rdv.priorite] ?? 'bg-gray-300'}`} />
              <div className="px-4 py-3 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-700">
                    {rdv.heureDebut} – {rdv.heureFin}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_STYLES[rdv.statut]}`}>
                    {STATUT_LABELS[rdv.statut]}
                  </span>
                </div>
                <p className="text-sm text-gray-800 font-medium truncate mt-0.5">
                  {rdv.patient ? `${rdv.patient.prenom} ${rdv.patient.nom}` : '—'}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">{rdv.typeEEG}</span>
                  <span className="text-xs text-gray-400">🏥 {rdv.salle}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
