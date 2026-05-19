'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDemandeById } from '@/services/demandes.service'
import { handleApiError } from '@/lib/handleApiError'
import FicheHeader from '@/components/fiche/FicheHeader'
import TabAPrescription from '@/components/fiche/TabA_Prescription'
import TabBRealisation from '@/components/fiche/TabB_Realisation'
import TabCCompteRendu from '@/components/fiche/TabC_CompteRendu'
import type { DemandeEEG } from '@/types/eeg/demande'

const TABS = [
  { id: 'A', label: '📋 Prescription' },
  { id: 'B', label: '🔬 Réalisation' },
  { id: 'C', label: '📝 Compte rendu' },
]

export default function FicheDemandePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [demande, setDemande] = useState<DemandeEEG | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [tabActif, setTabActif] = useState('A')

  const charger = useCallback(async () => {
    try {
      const data = await getDemandeById(id)
      setDemande(data)
    } catch (error) {
      setErreur(handleApiError(error))
    } finally {
      setChargement(false)
    }
  }, [id])

  useEffect(() => {
    charger()
  }, [charger])

  if (chargement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (erreur || !demande) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-gray-700 font-medium">{erreur || 'Demande introuvable'}</p>
        <button
          onClick={() => router.push('/eeg/worklist')}
          className="mt-4 text-sm text-[#6750a4] hover:underline"
        >
          ← Retour à la worklist
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <button
        onClick={() => router.push('/eeg/worklist')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6750a4] transition-colors"
      >
        ← Retour à la file de travail
      </button>

      {/* Header fiche */}
      <FicheHeader demande={demande} onRefresh={charger} />

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActif(tab.id)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
              tabActif === tab.id
                ? 'bg-[#6750a4] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu tab */}
      {tabActif === 'A' && <TabAPrescription demande={demande} />}
      {tabActif === 'B' && <TabBRealisation demande={demande} onRefresh={charger} />}
      {tabActif === 'C' && <TabCCompteRendu demande={demande} onRefresh={charger} />}
    </div>
  )
}
