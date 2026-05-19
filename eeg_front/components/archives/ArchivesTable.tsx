'use client'

import { useState } from 'react'
import ArchiveDetailModal from './ArchiveDetailModal'
import type { EegResultat } from '@/types/eeg/resultat'

interface ArchivesTableProps {
  resultats: EegResultat[]
}

export default function ArchivesTable({ resultats }: ArchivesTableProps) {
  const [selectionne, setSelectionne] = useState<EegResultat | null>(null)

  if (resultats.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-4xl mb-3">🗄️</p>
        <p className="text-gray-500 font-medium">Aucun résultat trouvé</p>
        <p className="text-gray-400 text-sm mt-1">Modifiez les filtres pour afficher des archives</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">N° EEG</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fichier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médecin validateur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date validation</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Critique</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resultats.map(resultat => (
                <tr
                  key={resultat.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectionne(resultat)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {resultat.demandeId.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">
                    {resultat.nomFichierOriginal ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {resultat.dureeEnregistrement ? `${resultat.dureeEnregistrement} min` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    {resultat.medecinValidateur
                      ? `Dr. ${resultat.medecinValidateur.nom}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {resultat.dateValidation
                      ? new Date(resultat.dateValidation).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {resultat.estCritique ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        🚨 Oui
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Non</span>
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectionne(resultat)}
                        className="text-xs text-[#6750a4] hover:underline font-medium"
                      >
                        Consulter
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        🖨️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectionne && (
        <ArchiveDetailModal
          resultat={selectionne}
          onFermer={() => setSelectionne(null)}
        />
      )}
    </>
  )
}
