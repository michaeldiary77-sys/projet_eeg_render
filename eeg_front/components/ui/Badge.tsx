'use client'

import type { StatutDemande } from '@/types/eeg/demande'
import type { NiveauUrgence } from '@/types/eeg/demande'

interface BadgeStatutProps {
  statut: StatutDemande
}

export function BadgeStatut({ statut }: BadgeStatutProps) {
  const styles: Record<StatutDemande, string> = {
    CREEE: 'bg-gray-100 text-gray-600',
    VALIDEE: 'bg-yellow-100 text-yellow-700',
    PLANIFIEE: 'bg-cyan-100 text-cyan-700',
    EN_COURS: 'bg-blue-100 text-blue-700',
    EN_INTERPRETATION: 'bg-purple-100 text-purple-700',
    RESULTAT_DISPONIBLE: 'bg-emerald-100 text-emerald-700',
    ACK_RECU: 'bg-violet-100 text-violet-700',
    ANNULEE: 'bg-gray-100 text-gray-400 line-through',
  }

  const labels: Record<StatutDemande, string> = {
    CREEE: 'Créée',
    VALIDEE: 'Validée',
    PLANIFIEE: 'Planifiée',
    EN_COURS: 'En cours',
    EN_INTERPRETATION: 'En interprétation',
    RESULTAT_DISPONIBLE: 'Résultat disponible',
    ACK_RECU: 'ACK reçu',
    ANNULEE: 'Annulée',
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[statut]}`}>
      {labels[statut]}
    </span>
  )
}

export function BadgeUrgence({ urgence }: { urgence: NiveauUrgence }) {
  const styles: Record<NiveauUrgence, string> = {
    STAT: 'bg-red-100 text-red-700 border border-red-300 animate-pulse',
    URGENTE: 'bg-orange-100 text-orange-700 border border-orange-300',
    NORMALE: 'bg-violet-100 text-violet-700 border border-violet-200',
  }

  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[urgence]}`}>
      {urgence === 'STAT' ? '🚨 STAT' : urgence === 'URGENTE' ? '⚠️ Urgente' : '📋 Normale'}
    </span>
  )
}

export { BadgeStatut as Badge }
