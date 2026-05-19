'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getNotificationsCount, getNotifications } from '@/services/notifications.service'
import { getRapportActivite } from '@/services/rapports.service'
import { getRdvsAujourdhui } from '@/services/rdvs.service'
import { getAudit } from '@/services/audit.service'
import KpiCard from '@/components/dashboard/KpiCard'
import AlertesActives from '@/components/dashboard/AlertesActives'
import PlanningDuJour from '@/components/dashboard/PlanningDuJour'
import DernieresActivites from '@/components/dashboard/DernieresActivites'
import type { Notification } from '@/types/eeg/notification'
import type { RendezVousEEG } from '@/types/eeg/rdv'
import type { EegAudit } from '@/types/eeg/audit'

export default function DashboardPage() {
  const { user } = useUser()

  const [nonLues, setNonLues] = useState(0)
  const [activite, setActivite] = useState({ recues: 0, traitees: 0, annulees: 0, enAttente: 0 })
  const [alertes, setAlertes] = useState<Notification[]>([])
  const [rdvs, setRdvs] = useState<RendezVousEEG[]>([])
  const [audit, setAudit] = useState<EegAudit[]>([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const charger = async () => {
      try {
        const [count, rapport, notifs, rdvJour, journal] = await Promise.allSettled([
          getNotificationsCount(),
          getRapportActivite(),
          getNotifications(false),
          getRdvsAujourdhui(),
          getAudit(),
        ])

        if (count.status === 'fulfilled') setNonLues(count.value.nonLues)
        if (rapport.status === 'fulfilled') setActivite(rapport.value)
        if (notifs.status === 'fulfilled') setAlertes(notifs.value)
        if (rdvJour.status === 'fulfilled') setRdvs(rdvJour.value)
        if (journal.status === 'fulfilled') setAudit(journal.value)
      } finally {
        setChargement(false)
      }
    }
    charger()
  }, [])

  if (chargement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bonjour, {user.prenom} {user.nom} — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Demandes reçues"
          value={activite.recues}
          icon="📥"
          variant="primary"
        />
        <KpiCard
          label="Demandes traitées"
          value={activite.traitees}
          icon="✅"
          variant="success"
        />
        <KpiCard
          label="En attente"
          value={activite.enAttente}
          icon="⏳"
          variant="warning"
        />
        <KpiCard
          label="Notifications non lues"
          value={nonLues}
          icon="🔔"
          variant="secondary"
          secondaryInfo={nonLues > 0 ? 'Cliquez sur Notifications' : 'Tout est lu'}
        />
      </div>

      {/* Alertes + Planning */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AlertesActives alertes={alertes} />
        <PlanningDuJour rdvs={rdvs} />
      </div>

      {/* Dernières activités */}
      <DernieresActivites activites={audit} />
    </div>
  )
}
