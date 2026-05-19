'use client'

import type { RendezVousEEG } from '@/types/eeg/rdv'

interface CalendrierSemaineProps {
  dateDebut: Date
  rdvs: RendezVousEEG[]
  onSelectRdv: (rdv: RendezVousEEG) => void
}

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HEURES = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

const PRIORITE_COULEUR: Record<string, string> = {
  STAT: 'bg-red-100 border-red-400 text-red-800',
  URGENTE: 'bg-orange-100 border-orange-400 text-orange-800',
  NORMALE: 'bg-violet-100 border-violet-400 text-violet-800',
}

function memeJour(dateRdv: string, refDate: Date): boolean {
  const d = new Date(dateRdv)
  return (
    d.getFullYear() === refDate.getFullYear() &&
    d.getMonth() === refDate.getMonth() &&
    d.getDate() === refDate.getDate()
  )
}

export default function CalendrierSemaine({
  dateDebut,
  rdvs,
  onSelectRdv,
}: CalendrierSemaineProps) {
  const jours = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(dateDebut)
    d.setDate(dateDebut.getDate() + i)
    return d
  })

  const aujourdhui = new Date()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header colonnes */}
      <div className="grid grid-cols-8 border-b border-gray-100">
        <div className="p-3 text-xs text-gray-400 text-center border-r border-gray-100">Heure</div>
        {jours.map((jour, i) => {
          const estAujourdhui = memeJour(jour.toISOString(), aujourdhui)
          return (
            <div
              key={i}
              className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${
                estAujourdhui ? 'bg-[#eaddff]' : ''
              }`}
            >
              <p className={`text-xs font-semibold ${estAujourdhui ? 'text-[#6750a4]' : 'text-gray-500'}`}>
                {JOURS[i]}
              </p>
              <p className={`text-sm font-bold ${estAujourdhui ? 'text-[#6750a4]' : 'text-gray-800'}`}>
                {jour.getDate()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Grille heures */}
      <div className="overflow-y-auto max-h-[600px]">
        {HEURES.map(heure => (
          <div key={heure} className="grid grid-cols-8 border-b border-gray-50 min-h-[64px]">
            <div className="p-2 text-xs text-gray-400 text-center border-r border-gray-100 pt-2">
              {heure}
            </div>
            {jours.map((jour, i) => {
              const rdvsColonne = rdvs.filter(r =>
                memeJour(r.dateRdv, jour) && r.heureDebut.startsWith(heure.split(':')[0])
              )
              return (
                <div
                  key={i}
                  className="p-1 border-r border-gray-50 last:border-r-0 space-y-1"
                >
                  {rdvsColonne.map(rdv => (
                    <button
                      key={rdv.id}
                      onClick={() => onSelectRdv(rdv)}
                      className={`w-full text-left text-xs p-1.5 rounded-lg border-l-2 transition-opacity hover:opacity-80 ${
                        PRIORITE_COULEUR[rdv.priorite]
                      }`}
                    >
                      <p className="font-semibold truncate">
                        {rdv.heureDebut}
                      </p>
                      <p className="truncate">
                        {rdv.patient
                          ? `${rdv.patient.prenom} ${rdv.patient.nom}`
                          : rdv.typeEEG}
                      </p>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
