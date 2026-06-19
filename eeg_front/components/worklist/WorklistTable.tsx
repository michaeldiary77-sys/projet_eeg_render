'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from "@/contexts/UserContext"
import { annulerDemande, validerDemande, refuserDemande, accuserReception, realiserDemande } from '@/services/demandes.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { DemandeEEG } from '@/types/eeg/demande'

interface WorklistTableProps {
  demandes: DemandeEEG[]
  onRefresh: () => void
}

const URGENCE_BADGE: Record<string, string> = {
  STAT: 'bg-red-100 text-red-700 border border-red-300 animate-pulse',
  URGENTE: 'bg-orange-100 text-orange-700 border border-orange-300',
  NORMALE: 'bg-violet-100 text-violet-700 border border-violet-200',
}

const STATUT_BADGE: Record<string, string> = {
  CREEE: 'bg-gray-100 text-gray-600',
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  RESULTAT_DISPONIBLE: 'bg-emerald-100 text-emerald-700',
  ACK_RECU: 'bg-violet-100 text-violet-700',
  ANNULEE: 'bg-gray-100 text-gray-400 line-through',
  VALIDEE: 'bg-cyan-100 text-cyan-700',
  PLANIFIEE: 'bg-indigo-100 text-indigo-700',
  EN_INTERPRETATION: 'bg-purple-100 text-purple-700',
}

const STATUT_LABELS: Record<string, string> = {
  CREEE: 'Créée',
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  RESULTAT_DISPONIBLE: 'Résultat disponible',
  ACK_RECU: 'ACK reçu',
  ANNULEE: 'Annulée',
  VALIDEE: 'Validée',
  PLANIFIEE: 'Planifiée',
  EN_INTERPRETATION: 'En interprétation',
}

function MinuterieSTAT({ dateCreation }: { dateCreation: string }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const calc = () => {
      setElapsed(Math.floor((Date.now() - new Date(dateCreation).getTime()) / 1000))
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [dateCreation])

  const minutes = Math.floor(elapsed / 60)
  const secondes = elapsed % 60
  const depasse = minutes >= 30
  const affichage = `${String(minutes).padStart(2, '0')}:${String(secondes).padStart(2, '0')}`

  return (
    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
      depasse ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-600'
    }`}>
      ⏱ {affichage}
    </span>
  )
}

export default function WorklistTable({ demandes, onRefresh }: WorklistTableProps) {
  const { user } = useUser()
  const router = useRouter()
  const [annulationId, setAnnulationId] = useState<string | null>(null)
  const [motif, setMotif] = useState('')
  const [refusId, setRefusId] = useState<string | null>(null)
  const [motifRefus, setMotifRefus] = useState('')
  const [enCours, setEnCours] = useState(false)

  const confirmerAnnulation = useCallback(async () => {
    if (!annulationId || !motif.trim()) return
    setEnCours(true)
    try {
      await annulerDemande(annulationId, motif.trim())
      toast.success('Demande annulée avec succès')
      setAnnulationId(null)
      setMotif('')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }, [annulationId, motif, onRefresh])

  const confirmerRefus = useCallback(async () => {
    if (!refusId || !motifRefus.trim()) return
    setEnCours(true)
    try {
      await refuserDemande(refusId, motifRefus.trim())
      toast.success('Demande refusée')
      setRefusId(null)
      setMotifRefus('')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }, [refusId, motifRefus, onRefresh])
  const handleConfirmSlot = async (slot: { dateRDV: string; heureDebut: string; salle: string }) => {
    if (!demandeToPlan) return
    try {
      const { planifierRdv } = await import('@/services/demandes.service')
      await planifierRdv(demandeToPlan.id, slot)
      toast.success('RDV planifié ✅')
      setSlotPickerOpen(false)
      setDemandeToPlan(null)
      onRefresh()
      window.location.href = `/eeg/planning?demandeId=${demandeToPlan.id}`
    } catch (err) {
      toast.error(handleApiError(err))
    }
  }


  if (demandes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-gray-500 font-medium">Aucune demande trouvée</p>
        <p className="text-gray-400 text-sm mt-1">Modifiez les filtres pour afficher plus de résultats</p>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">N° EEG</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prescripteur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Minuterie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demandes.map(demande => (
                <tr
                  key={demande.id}
                  onClick={() => router.push(`/eeg/worklist/${demande.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${URGENCE_BADGE[demande.urgence]}`}>
                      {demande.urgence}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {demande.patient ? (
                      <div>
                        <p className="font-medium text-gray-800">
                          {demande.patient.prenom} {demande.patient.nom}
                        </p>
                        <p className="text-xs text-gray-400">{demande.patient.idDossier}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {demande.numeroEEG}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {demande.typeEEG}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {demande.prescripteur
                      ? `Dr. ${demande.prescripteur.nom}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_BADGE[demande.statut]}`}>
                      {STATUT_LABELS[demande.statut]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {demande.urgence === 'STAT' && demande.statut !== 'ANNULEE' && (
                      <MinuterieSTAT dateCreation={demande.dateCreation} />
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {demande.statut === "CREEE" && user?.role === "MEDECIN_SERVICE" && demande.urgence !== "STAT" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            await validerDemande(demande.id)
                            toast.success('Demande validée ✅')
                            onRefresh()
                          } catch (err) {
                            toast.error(handleApiError(err))
                          }
                        }}
                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1 rounded-lg transition-colors mr-2"
                      >
                        ✅ Valider
                      </button>
                    )}
                    {demande.statut === "CREEE" && user?.role === "MEDECIN_SERVICE" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setRefusId(demande.id); setMotifRefus('') }}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-lg transition-colors mr-2"
                      >
                        ❌ Refuser
                      </button>
                    )}
                    {demande.statut === "VALIDEE" && user?.role === "CHEF_SERVICE" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const { planifierRdv } = await import("@/services/demandes.service");
                            await planifierRdv(demande.id, { dateRDV: new Date(Date.now() + 2  *24*  60  *60*  1000).toISOString() });
                            window.location.href = `/eeg/planning?demandeId=${demande.id}`;
                          } catch (err) {
                            toast.error(handleApiError(err));
                          }
                        }}
                        className="text-xs bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-3 py-1 rounded-lg transition-colors mr-2"
                      >
                        Planifier
                      </button>
                    )}
                    {demande.statut === "RESULTAT_DISPONIBLE" && user?.role === "MEDECIN_SERVICE" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            await accuserReception(demande.id)
                            toast.success('Accusé réception enregistré ✅')
                            onRefresh()
                          } catch (err) {
                            toast.error(handleApiError(err))
                          }
                        }}
                        className="text-xs bg-violet-500 hover:bg-violet-600 text-white font-medium px-3 py-1 rounded-lg transition-colors mr-2"
                      >
                        📥 Acquitter
                      </button>
                    )}
                    {demande.statut === "CREEE" && demande.urgence === "STAT" && user?.role === "TECHNICIEN" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            await realiserDemande(demande.id)
                            toast.success('Demande STAT prise en charge ✅')
                            onRefresh()
                          } catch (err) {
                            toast.error(handleApiError(err))
                          }
                        }}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-lg transition-colors mr-2"
                      >
                        🚨 Réaliser STAT
                      </button>
                    )}
                    {!['ANNULEE', 'ACK_RECU', 'RESULTAT_DISPONIBLE'].includes(demande.statut) && (
                      <button
                        onClick={() => { setAnnulationId(demande.id); setMotif('') }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {annulationId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Annuler la demande</h3>
            <p className="text-sm text-gray-500 mb-4">Le motif est obligatoire et ne pourra pas être modifié.</p>
            <textarea
              value={motif}
              onChange={e => setMotif(e.target.value)}
              placeholder="Motif d'annulation obligatoire..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] resize-none"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => { setAnnulationId(null); setMotif('') }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmerAnnulation}
                disabled={!motif.trim() || enCours}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enCours ? 'En cours...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {refusId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Refuser la demande</h3>
            <p className="text-sm text-gray-500 mb-4">Le motif est obligatoire pour tracer le refus médical.</p>
            <textarea
              value={motifRefus}
              onChange={e => setMotifRefus(e.target.value)}
              placeholder="Motif du refus (ex: indication non pertinente, patient hors protocole...)"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] resize-none"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => { setRefusId(null); setMotifRefus('') }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmerRefus}
                disabled={!motifRefus.trim() || enCours}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enCours ? 'En cours...' : 'Confirmer le refus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
