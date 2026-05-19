'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPatientById } from '@/services/patients.service'
import { getDemandesByPatient } from '@/services/demandes.service'
import PatientHistorique from '@/components/patients/PatientHistorique'
import { handleApiError } from '@/lib/handleApiError'
import type { Patient } from '@/types/eeg/patient'
import type { DemandeEEG } from '@/types/eeg/demande'

export default function FichePatientPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [demandes, setDemandes] = useState<DemandeEEG[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const charger = useCallback(async () => {
    try {
      const [p, d] = await Promise.all([
        getPatientById(id),
        getDemandesByPatient(id),
      ])
      setPatient(p)
      setDemandes(d)
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

  if (erreur || !patient) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-gray-700 font-medium">{erreur || 'Patient introuvable'}</p>
        <button
          onClick={() => router.push('/eeg/patients')}
          className="mt-4 text-sm text-[#6750a4] hover:underline"
        >
          ← Retour aux patients
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <button
        onClick={() => router.push('/eeg/patients')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6750a4] transition-colors"
      >
        ← Retour aux patients
      </button>

      {/* Carte patient */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 ${
            patient.sexe === 'M'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-pink-100 text-pink-700'
          }`}>
            {patient.prenom[0]}{patient.nom[0]}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.prenom} {patient.nom}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm text-gray-500">{patient.age} ans</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                patient.sexe === 'M'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-pink-100 text-pink-700'
              }`}>
                {patient.sexe === 'M' ? '♂ Masculin' : '♀ Féminin'}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              📁 Dossier : <span className="font-mono font-medium">{patient.idDossier}</span>
            </p>
          </div>

          {/* Compteurs */}
          {patient._count && (
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6750a4]">{patient._count.demandes}</p>
                <p className="text-xs text-gray-400">demandes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{patient._count.rdvs}</p>
                <p className="text-xs text-gray-400">RDV</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historique demandes */}
      <PatientHistorique demandes={demandes} />
    </div>
  )
}
