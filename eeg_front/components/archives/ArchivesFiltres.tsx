'use client'

import { useEffect, useState } from 'react'
import type { ArchivesFiltres } from '@/types/eeg/archives'

interface ArchivesFiltresProps {
  onChangeFiltres: (filtres: ArchivesFiltres) => void
}

export default function ArchivesFiltresComponent({ onChangeFiltres }: ArchivesFiltresProps) {
  const [numeroEEG, setNumeroEEG] = useState('')
  const [typeEEG, setTypeEEG] = useState('')
  const [patientId, setPatientId] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [conclusion, setConclusion] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeFiltres({
        numeroEEG: numeroEEG || undefined,
        typeEEG: typeEEG || undefined,
        dateDebut: dateDebut || undefined,
        dateFin: dateFin || undefined,
        conclusion: conclusion || undefined,
        page: 1,
      })
    }, 300)
    return () => clearTimeout(timeout)
  }, [numeroEEG, typeEEG, patientId, dateDebut, dateFin, conclusion, onChangeFiltres])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Numéro EEG */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Numéro EEG..."
            value={numeroEEG}
            onChange={e => setNumeroEEG(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
          />
        </div>

        {/* Type EEG */}
        <select
          value={typeEEG}
          onChange={e => setTypeEEG(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
        >
          <option value="">Tous types EEG</option>
          <option value="STANDARD">Standard</option>
          <option value="SOMMEIL">Sommeil</option>
          <option value="AMBULATOIRE">Ambulatoire</option>
          <option value="VIDEO_EEG">Vidéo-EEG</option>
        </select>

        {/* Recherche conclusion */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📝</span>
          <input
            type="text"
            placeholder="Recherche dans conclusion..."
            value={conclusion}
            onChange={e => setConclusion(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
          />
        </div>

        {/* Date début */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Date validation — début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={e => setDateDebut(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
          />
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Date validation — fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={e => setDateFin(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
          />
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setNumeroEEG('')
              setTypeEEG('')
              setPatientId('')
              setDateDebut('')
              setDateFin('')
              setConclusion('')
            }}
            className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🔄 Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}
