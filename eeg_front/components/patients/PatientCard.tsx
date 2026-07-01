'use client'

import { useRouter } from 'next/navigation'
import type { Patient } from '@/types/eeg/patient'

interface PatientCardProps {
  patient: Patient
}

export default function PatientCard({ patient }: PatientCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/eeg/patients/${patient.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-[#6750a4]/30 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            patient.sexe === 'M'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-pink-100 text-pink-700'
          }`}>
            {patient.prenom[0]}{patient.nom[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {patient.prenom} {patient.nom}
            </p>
            <p className="text-xs text-gray-400">
              {patient.age ? `${patient.age} ans` : 'Âge inconnu'} — {patient.sexe === 'M' ? '♂ Masculin' : patient.sexe === 'F' ? '♀ Féminin' : 'Sexe inconnu'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400 shrink-0">
          {patient.idDossier}
        </span>
      </div>

      {/* Compteurs */}
      {patient._count && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6750a4]" />
            <span className="text-xs text-gray-500">
              {patient._count.demandes} demande{patient._count.demandes > 1 ? 's' : ''} EEG
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-gray-500">
              {patient._count.rdvs} RDV
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
