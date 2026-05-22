'use client'

import { useUser } from '@/contexts/UserContext'

interface PlanningToolbarProps {
  dateDebut: Date
  onSemainePrecedente: () => void
  onSemaineSuivante: () => void
  onNouveauRdv: () => void
}

function formatSemaine(dateDebut: Date): string {
  const dateFin = new Date(dateDebut)
  dateFin.setDate(dateDebut.getDate() + 6)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
  const optionsFin: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  return `Semaine du ${dateDebut.toLocaleDateString('fr-FR', options)} — ${dateFin.toLocaleDateString('fr-FR', optionsFin)}`
}

export default function PlanningToolbar({
  dateDebut,
  onSemainePrecedente,
  onSemaineSuivante,
  onNouveauRdv,
}: PlanningToolbarProps) {
  const { user } = useUser()
  const peutCreer = user.role === 'TECHNICIEN' || user.role === 'CHEF_SERVICE'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Planning RDV</h1>
        <p className="text-sm text-gray-500 mt-1">{formatSemaine(dateDebut)}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
          <button
            onClick={onSemainePrecedente}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Précédente
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <button
            onClick={onSemaineSuivante}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Suivante →
          </button>
        </div>

        {peutCreer && (
          <button
            onClick={onNouveauRdv}
            className="flex items-center gap-2 px-4 py-2 bg-[#6750a4] text-white text-sm font-semibold rounded-xl hover:bg-[#5a4490] transition-colors shadow-sm"
          >
            + Nouveau RDV
          </button>
        )}
      </div>
    </div>
  )
}
