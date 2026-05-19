'use client'
import type { RapportDelais } from '@/types/eeg/rapports'

interface Props {
  data: RapportDelais
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h}h${m > 0 ? m + 'min' : ''}`
}

export default function DelaisChart({ data }: Props) {
  const maxVal = Math.max(data.delaiMoyenTraitementMinutes, data.delaiMoyenAckMinutes, 1)

  const barres = [
    {
      label: 'Délai moyen traitement',
      souslabel: 'Création → Validation',
      valeur: data.delaiMoyenTraitementMinutes,
      couleur: 'bg-[#6750a4]',
    },
    {
      label: 'Délai moyen ACK',
      souslabel: 'Validation → ACK médecin',
      valeur: data.delaiMoyenAckMinutes,
      couleur: 'bg-[#625b71]',
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-1">Délais moyens</h3>
      <p className="text-xs text-gray-400 mb-6">Sur {data.nombreDemandes} demandes analysées</p>
      <div className="space-y-6">
        {barres.map(barre => (
          <div key={barre.label}>
            <div className="flex justify-between items-center mb-1">
              <div>
                <p className="text-sm font-medium text-gray-700">{barre.label}</p>
                <p className="text-xs text-gray-400">{barre.souslabel}</p>
              </div>
              <span className="text-lg font-bold text-gray-800">{formatMinutes(barre.valeur)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`${barre.couleur} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((barre.valeur / maxVal) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
