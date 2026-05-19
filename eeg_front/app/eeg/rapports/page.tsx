'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { getRapportActivite, getRapportDelais, getRapportAnomalies } from '@/services/rapports.service'
import type { RapportActivite, RapportDelais } from '@/types/eeg/rapports'
import KpiRapport from '@/components/rapports/KpiRapport'
import DelaisChart from '@/components/rapports/DelaisChart'
import AnomaliesTable from '@/components/rapports/AnomaliesTable'

export default function RapportsPage() {
  const { user } = useUser()
  const router = useRouter()
  const [activite, setActivite] = useState<RapportActivite | null>(null)
  const [delais, setDelais] = useState<RapportDelais | null>(null)
  const [anomalies, setAnomalies] = useState<unknown[]>([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    if (user.role !== 'MAJOR') {
      router.replace('/eeg/dashboard')
      return
    }
    const fetchAll = async () => {
      try {
        const [a, d, an] = await Promise.all([
          getRapportActivite(),
          getRapportDelais(),
          getRapportAnomalies(),
        ])
        setActivite(a)
        setDelais(d)
        setAnomalies(an)
      } catch (err) {
        console.error(err)
      } finally {
        setChargement(false)
      }
    }
    fetchAll()
  }, [user.role, router])

  if (user.role !== 'MAJOR') return null

  if (chargement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6750a4]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Rapports statistiques</h1>
        <p className="text-gray-400 text-sm mt-1">Supervision — Accès Major uniquement</p>
      </div>

      {activite && <KpiRapport data={activite} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {delais && <DelaisChart data={delais} />}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Résumé activité</h3>
          {activite && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Taux de traitement</span>
                <span className="font-bold text-green-600">
                  {activite.recues > 0
                    ? Math.round((activite.traitees / activite.recues) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: activite.recues > 0
                      ? `${Math.round((activite.traitees / activite.recues) * 100)}%`
                      : '0%'
                  }}
                />
              </div>
              <div className="flex justify-between text-sm mt-4">
                <span className="text-gray-500">Taux d'annulation</span>
                <span className="font-bold text-red-500">
                  {activite.recues > 0
                    ? Math.round((activite.annulees / activite.recues) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-red-400 h-2 rounded-full"
                  style={{
                    width: activite.recues > 0
                      ? `${Math.round((activite.annulees / activite.recues) * 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <AnomaliesTable data={anomalies} />
    </div>
  )
}
