'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPatients } from '@/services/patients.service'
import PatientCard from '@/components/patients/PatientCard'
import type { Patient } from '@/types/eeg/patient'

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')

  const charger = useCallback(async (search: string) => {
    setChargement(true)
    try {
      const data = await getPatients(search || undefined)
      setPatients(data)
    } catch {
      setPatients([])
    } finally {
      setChargement(false)
    }
  }, [])

  // Debounce recherche 300ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      charger(recherche)
    }, 300)
    return () => clearTimeout(timeout)
  }, [recherche, charger])

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {patients.length} patient{patients.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Barre recherche */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou numéro dossier..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] focus:border-transparent"
        />
      </div>

      {/* Liste patients */}
      {chargement ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-gray-500 font-medium">Aucun patient trouvé</p>
          <p className="text-gray-400 text-sm mt-1">
            {recherche ? 'Modifiez votre recherche' : 'Aucun patient enregistré'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {patients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  )
}
