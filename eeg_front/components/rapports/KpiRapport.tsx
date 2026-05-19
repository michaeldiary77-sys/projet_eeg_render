'use client'
import type { RapportActivite } from '@/types/eeg/rapports'

interface Props {
  data: RapportActivite
}

export default function KpiRapport({ data }: Props) {
  const cartes = [
    { label: 'Demandes reçues', value: data.recues, couleur: 'bg-[#eaddff] text-[#6750a4]', icone: '📥' },
    { label: 'Traitées', value: data.traitees, couleur: 'bg-green-100 text-green-700', icone: '✅' },
    { label: 'Annulées', value: data.annulees, couleur: 'bg-red-100 text-red-700', icone: '❌' },
    { label: 'En attente', value: data.enAttente, couleur: 'bg-yellow-100 text-yellow-700', icone: '⏳' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cartes.map(carte => (
        <div key={carte.label} className={`rounded-xl p-4 ${carte.couleur}`}>
          <div className="text-2xl mb-1">{carte.icone}</div>
          <div className="text-3xl font-bold">{carte.value}</div>
          <div className="text-sm font-medium mt-1">{carte.label}</div>
        </div>
      ))}
    </div>
  )
}
