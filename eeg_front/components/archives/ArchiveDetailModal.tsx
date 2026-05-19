'use client'

import type { EegResultat } from '@/types/eeg/resultat'

interface ArchiveDetailModalProps {
  resultat: EegResultat
  onFermer: () => void
}

export default function ArchiveDetailModal({ resultat, onFermer }: ArchiveDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📄 Détail du résultat EEG</h3>
            <p className="text-xs text-gray-400 mt-0.5">Lecture seule — résultat validé</p>
          </div>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Badge immutable */}
          <div className="flex items-center gap-2 p-3 bg-violet-50 rounded-lg border border-violet-200">
            <span className="text-violet-600">🔒</span>
            <p className="text-sm text-violet-700 font-medium">Résultat validé et signé</p>
            {resultat.estCritique && (
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                🚨 Critique
              </span>
            )}
          </div>

          {/* Médecin validateur */}
          {resultat.medecinValidateur && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Médecin validateur</p>
                <p className="text-sm font-medium text-gray-800">
                  Dr. {resultat.medecinValidateur.prenom} {resultat.medecinValidateur.nom}
                </p>
                <p className="text-xs text-gray-400">{resultat.medecinValidateur.role}</p>
                {resultat.medecinValidateur.numeroOrdre && (
                  <p className="text-xs text-gray-400 font-mono">{resultat.medecinValidateur.numeroOrdre}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date validation</p>
                <p className="text-sm font-medium text-gray-800">
                  {resultat.dateValidation
                    ? new Date(resultat.dateValidation).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })
                    : '—'}
                </p>
              </div>
            </div>
          )}

          {/* Infos techniques */}
          {(resultat.nomFichierOriginal || resultat.dureeEnregistrement) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              {resultat.nomFichierOriginal && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Fichier EDF</p>
                  <p className="text-sm font-mono text-gray-700 truncate">{resultat.nomFichierOriginal}</p>
                </div>
              )}
              {resultat.dureeEnregistrement && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Durée</p>
                  <p className="text-sm text-gray-700">{resultat.dureeEnregistrement} minutes</p>
                </div>
              )}
            </div>
          )}

          {/* Champs cliniques */}
          {[
            { label: 'Rythmes de fond', value: resultat.rythmesDeFond },
            { label: 'Anomalies détectées', value: resultat.anomaliesDetectees },
            { label: 'Conclusion diagnostique', value: resultat.conclusionDiagnostique },
            { label: 'Compte rendu global', value: resultat.compteRendu },
          ].map(({ label, value }) => value ? (
            <div key={label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
              <p className="text-sm text-gray-800 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                {value}
              </p>
            </div>
          ) : null)}

          {/* Historique rectifications */}
          {resultat.rectifications && resultat.rectifications.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                Historique rectifications ({resultat.rectifications.length})
              </p>
              <ul className="space-y-3">
                {resultat.rectifications.map(r => (
                  <li key={r.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-700">✏️ Rectification</span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.dateRectification).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Motif :</span> {r.motif}
                    </p>
                    {r.nouvelleConclusion && (
                      <p className="text-xs text-gray-500 mt-1">
                        Nouvelle conclusion : {r.nouvelleConclusion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">Version {resultat.version}</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={onFermer}
              className="px-4 py-2 text-sm bg-[#6750a4] text-white font-semibold rounded-lg hover:bg-[#5a4490] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
