'use client'

import { useEffect, useState } from 'react'
import { getRdvs } from '@/services/rdvs.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { DemandeEEG } from '@/types/eeg/demande'
import type { RendezVousEEG } from '@/types/eeg/rdv'

interface SlotPickerModalProps {
  demande: DemandeEEG | null
  onClose: () => void
  onConfirm: (slot: { dateRDV: string; heureDebut: string; salle: string }) => Promise<void>
}

const SALLES = ['Salle 01', 'Salle 02', 'Salle 03']
const HEURES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

export default function SlotPickerModal({ demande, onClose, onConfirm }: SlotPickerModalProps) {
  const [rdvs, setRdvs] = useState<RendezVousEEG[]>([])
  const [chargement, setChargement] = useState(false)
  const [selected, setSelected] = useState<{ jour: number; salle: string; heure: string } | null>(null)
  const [confirming, setConfirming] = useState(false)

  // 5 jours à partir de demain (J+2 = après-demain = index 1)
  const jours = Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    d.setHours(0, 0, 0, 0)
    return d
  })

  useEffect(() => {
    if (!demande) return
    const charger = async () => {
      setChargement(true)
      try {
        const dateDebut = jours[0].toISOString().split('T')[0]
        const dateFin = jours[4].toISOString().split('T')[0]
        const data = await getRdvs({ dateDebut, dateFin })
        setRdvs(data)
      } catch (error) {
        toast.error(handleApiError(error))
      } finally {
        setChargement(false)
      }
    }
    charger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demande?.id])

  const isOccupied = (jour: Date, salle: string, heure: string) => {
    return rdvs.some(r => {
      if (!r.dateRdv) return false
      const rDate = new Date(r.dateRdv).toDateString()
      return rDate === jour.toDateString() && r.salle === salle && r.heureDebut === heure
    })
  }

  const handleConfirm = async () => {
    if (!selected || !demande) return
    setConfirming(true)
    try {
      const dateRdv = jours[selected.jour]
      await onConfirm({
        dateRDV: dateRdv.toISOString(),
        heureDebut: selected.heure,
        salle: selected.salle,
      })
    } finally {
      setConfirming(false)
    }
  }

  if (!demande) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📅 Planifier un RDV</h3>
            <p className="text-sm text-gray-500 mt-1">
              Demande {demande.numeroEEG} — {demande.patient?.prenom} {demande.patient?.nom}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {chargement ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-gray-200 bg-gray-50 p-2 text-left font-semibold text-gray-500">
                      Heure
                    </th>
                    {jours.map((jour, idx) => (
                      <th key={idx} colSpan={3} className="border border-gray-200 bg-gray-50 p-2 font-semibold text-gray-700">
                        <div>{jour.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                        <div className="text-sm">{jour.getDate()}/{jour.getMonth() + 1}</div>
                        {idx === 1 && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#eaddff] text-[#6750a4] rounded text-xs">
                            J+2
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {jours.flatMap((_, jIdx) =>
                      SALLES.map(salle => (
                        <th key={`${jIdx}-${salle}`} className="border border-gray-200 bg-gray-50 p-1 text-gray-500 font-normal">
                          {salle.split(' ')[1]}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {HEURES.map(heure => (
                    <tr key={heure}>
                      <td className="border border-gray-200 bg-gray-50 p-2 font-semibold text-gray-600 text-center">
                        {heure}
                      </td>
                      {jours.flatMap((jour, jIdx) =>
                        SALLES.map(salle => {
                          const occupe = isOccupied(jour, salle, heure)
                          const isSelected =
                            selected?.jour === jIdx &&
                            selected?.salle === salle &&
                            selected?.heure === heure
                          return (
                            <td
                              key={`${jIdx}-${salle}-${heure}`}
                              onClick={() => !occupe && setSelected({ jour: jIdx, salle, heure })}
                              className={`border border-gray-100 p-2 text-center cursor-pointer transition-colors ${
                                occupe
                                  ? 'bg-red-100 text-red-700 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#6750a4] text-white font-bold'
                                  : 'bg-green-50 hover:bg-green-100 text-green-700'
                              }`}
                              title={occupe ? 'Occupé' : `Cliquer pour choisir ${salle} à ${heure}`}
                            >
                              {occupe ? '✕' : isSelected ? '✓' : '·'}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span>🟢 Libre</span>
              <span>🔴 Occupé</span>
              <span>🟣 Sélectionné</span>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm">
                {selected ? (
                  <span className="text-[#6750a4] font-semibold">
                    ✨ {jours[selected.jour].toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} • {selected.heure} • {selected.salle}
                  </span>
                ) : (
                  <span className="text-gray-500">Cliquez sur une case verte pour choisir un créneau</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selected || confirming}
                  className="px-5 py-2 text-sm bg-[#6750a4] text-white font-semibold rounded-lg hover:bg-[#5a4490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {confirming ? 'Confirmation...' : '✅ Confirmer le créneau'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
