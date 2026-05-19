'use client'

import { useEffect, useState } from 'react'
import { getDemandesByPatient } from '@/services/demandes.service'
import type { DemandeEEG } from '@/types/eeg/demande'

interface TabAPrescriptionProps {
  demande: DemandeEEG
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

export default function TabAPrescription({ demande }: TabAPrescriptionProps) {
  const [historique, setHistorique] = useState<DemandeEEG[]>([])

  useEffect(() => {
    if (demande.patientId) {
      getDemandesByPatient(demande.patientId)
        .then(data => setHistorique(data.filter(d => d.id !== demande.id)))
        .catch(() => {})
    }
  }, [demande.patientId, demande.id])

  return (
    <div className="space-y-6">
      {/* Détails prescription */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📋 Détails de la prescription</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type EEG</p>
            <p className="text-sm font-medium text-gray-800">{demande.typeEEG}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Urgence</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${URGENCE_BADGE[demande.urgence]}`}>
              {demande.urgence}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Épisode de soins</p>
            <p className="text-sm font-mono text-gray-700">{demande.episodeSoinsId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date RDV planifié</p>
            <p className="text-sm text-gray-700">
              {demande.dateRDV
                ? new Date(demande.dateRDV).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : 'Non planifié'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Motif de prescription</p>
            <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">
              {demande.motifPrescription}
            </p>
          </div>
        </div>
      </div>

      {/* Historique EEG patient */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          🕒 Historique EEG du patient
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({historique.length} autre{historique.length > 1 ? 's' : ''})
          </span>
        </h3>

        {historique.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucun antécédent EEG</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {historique.map(h => (
              <li key={h.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-mono text-gray-700">{h.numeroEEG}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(h.dateCreation).toLocaleDateString('fr-FR')} — {h.typeEEG}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${URGENCE_BADGE[h.urgence]}`}>
                    {h.urgence}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_BADGE[h.statut]}`}>
                    {h.statut}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
