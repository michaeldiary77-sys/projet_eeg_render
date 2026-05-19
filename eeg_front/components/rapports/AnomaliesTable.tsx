'use client'

interface Props {
  data: unknown[]
}

interface ResultatCritique {
  id: string
  demandeId: string
  estCritique: boolean
  dateValidation?: string
  demande?: {
    numeroEEG: string
    statut: string
    patient?: {
      nom: string
      prenom: string
      idDossier: string
    }
    dateAck?: string
  }
}

export default function AnomaliesTable({ data }: Props) {
  const resultats = data as ResultatCritique[]

  if (resultats.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-4xl mb-2">✅</p>
        <p className="text-gray-500 font-medium">Aucun résultat critique</p>
        <p className="text-xs text-gray-400 mt-1">Tous les examens sont dans la norme</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-red-500">⚠️</span>
        <h3 className="font-semibold text-gray-800">Résultats critiques</h3>
        <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {resultats.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Numéro EEG</th>
              <th className="px-6 py-3 text-left">Patient</th>
              <th className="px-6 py-3 text-left">Statut demande</th>
              <th className="px-6 py-3 text-left">Date validation</th>
              <th className="px-6 py-3 text-left">ACK reçu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resultats.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-mono font-medium text-[#6750a4]">
                  {r.demande?.numeroEEG ?? '—'}
                </td>
                <td className="px-6 py-3">
                  {r.demande?.patient
                    ? `${r.demande.patient.prenom} ${r.demande.patient.nom}`
                    : '—'}
                  {r.demande?.patient && (
                    <span className="block text-xs text-gray-400">{r.demande.patient.idDossier}</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {r.demande?.statut ?? '—'}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500">
                  {r.dateValidation
                    ? new Date(r.dateValidation).toLocaleDateString('fr-FR')
                    : '—'}
                </td>
                <td className="px-6 py-3">
                  {r.demande?.dateAck ? (
                    <span className="text-green-600 font-medium">✓ Oui</span>
                  ) : (
                    <span className="text-red-500 font-medium">✗ Non</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
