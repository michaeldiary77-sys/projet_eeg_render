import type { StatutDemande, NiveauUrgence } from '@/types/eeg/demande'
import type { StatutRdv } from '@/types/eeg/rdv'

interface BadgeUrgenceProps {
  urgence: NiveauUrgence
}

interface BadgeStatutProps {
  statut: StatutDemande
}

interface BadgeStatutRdvProps {
  statut: StatutRdv
}

export function BadgeUrgence({ urgence }: BadgeUrgenceProps) {
  const styles: Record<NiveauUrgence, string> = {
    STAT: 'bg-red-100 text-red-700 animate-pulse font-bold',
    URGENTE: 'bg-orange-100 text-orange-700 font-semibold',
    NORMALE: 'bg-[#eaddff] text-[#6750a4]',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${styles[urgence]}`}>
      {urgence}
    </span>
  )
}

export function BadgeStatut({ statut }: BadgeStatutProps) {
  const styles: Record<StatutDemande, string> = {
    CREEE: 'bg-gray-100 text-gray-600',
    EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
    EN_COURS: 'bg-blue-100 text-blue-700 animate-pulse',
    RESULTAT_DISPONIBLE: 'bg-green-100 text-green-700',
    ACK_RECU: 'bg-[#eaddff] text-[#6750a4]',
    ANNULEE: 'bg-gray-100 text-gray-400 line-through',
  }
  const labels: Record<StatutDemande, string> = {
    CREEE: 'Créée',
    EN_ATTENTE: 'En attente',
    EN_COURS: 'En cours',
    RESULTAT_DISPONIBLE: 'Résultat disponible',
    ACK_RECU: 'ACK reçu',
    ANNULEE: 'Annulée',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${styles[statut]}`}>
      {labels[statut]}
    </span>
  )
}

export function BadgeStatutRdv({ statut }: BadgeStatutRdvProps) {
  const styles: Record<StatutRdv, string> = {
    EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
    REALISE: 'bg-green-100 text-green-700',
    NON_REALISE: 'bg-red-100 text-red-700',
    ANNULE: 'bg-gray-100 text-gray-400',
  }
  const labels: Record<StatutRdv, string> = {
    EN_ATTENTE: 'En attente',
    REALISE: 'Réalisé',
    NON_REALISE: 'Non réalisé',
    ANNULE: 'Annulé',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${styles[statut]}`}>
      {labels[statut]}
    </span>
  )
}
