'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { realiserRdv, marquerNonRealise, annulerRdv } from '@/services/rdvs.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { RendezVousEEG } from '@/types/eeg/rdv'

interface PanneauDetailRDVProps {
  rdv: RendezVousEEG
  onFermer: () => void
  onModifier: () => void
  onRefresh: () => void
}

const STATUT_BADGE: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  REALISE: 'bg-emerald-100 text-emerald-700',
  NON_REALISE: 'bg-red-100 text-red-700',
  ANNULE: 'bg-gray-100 text-gray-400',
}

const PRIORITE_BARRE: Record<string, string> = {
  STAT: 'bg-red-500',
  URGENTE: 'bg-orange-400',
  NORMALE: 'bg-violet-400',
}

export default function PanneauDetailRDV({
  rdv,
  onFermer,
  onModifier,
  onRefresh,
}: PanneauDetailRDVProps) {
  const { user } = useUser()
  const [enCours, setEnCours] = useState<string | null>(null)

  const peutModifier = user.role === 'TECHNICIEN_EEG' || user.role === 'NEUROLOGUE'

  const action = async (type: string, fn: () => Promise<unknown>) => {
    setEnCours(type)
    try {
      await fn()
      toast.success('Statut mis à jour')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(null)
    }
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
      {/* Header */}
      <div className={`h-1.5 ${PRIORITE_BARRE[rdv.priorite]}`} />
      <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUT_BADGE[rdv.statut]}`}>
              {rdv.statut}
            </span>
            <span className="text-xs text-gray-400">{rdv.priorite}</span>
          </div>
          <p className="font-semibold text-gray-900">
            {rdv.patient ? `${rdv.patient.prenom} ${rdv.patient.nom}` : '—'}
          </p>
          {rdv.patient && (
            <p className="text-xs text-gray-400">
              {rdv.patient.age} ans — {rdv.patient.sexe === 'M' ? '♂' : '♀'}
            </p>
          )}
        </div>
        <button
          onClick={onFermer}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type EEG</p>
            <p className="text-sm font-medium text-gray-700">{rdv.typeEEG}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Salle</p>
            <p className="text-sm font-medium text-gray-700">🏥 {rdv.salle}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Horaire</p>
            <p className="text-sm font-medium text-gray-700">
              {rdv.heureDebut} – {rdv.heureFin}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Durée</p>
            <p className="text-sm font-medium text-gray-700">{rdv.dureeMinutes} min</p>
          </div>
        </div>

        {rdv.renseignementClinique && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Renseignement clinique
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
              {rdv.renseignementClinique}
            </p>
          </div>
        )}

        {rdv.demande && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Demande liée</p>
            <p className="text-sm font-mono text-gray-700">{rdv.demande.numeroEEG}</p>
            <p className="text-xs text-gray-400">{rdv.demande.statut}</p>
          </div>
        )}

        {rdv.prescripteur && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Prescripteur</p>
            <p className="text-sm text-gray-700">Dr. {rdv.prescripteur.nom}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {peutModifier && (
        <div className="p-5 border-t border-gray-100 space-y-2">
          {rdv.statut === 'EN_ATTENTE' && (
            <>
              <button
                onClick={() => action('realiser', () => realiserRdv(rdv.id, user.id))}
                disabled={enCours !== null}
                className="w-full py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors"
              >
                {enCours === 'realiser' ? 'En cours...' : '✅ Réalisé'}
              </button>
              <button
                onClick={() => action('nonrealise', () => marquerNonRealise(rdv.id))}
                disabled={enCours !== null}
                className="w-full py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-200 disabled:opacity-50 transition-colors"
              >
                {enCours === 'nonrealise' ? 'En cours...' : '❌ Pas encore'}
              </button>
            </>
          )}
          <button
            onClick={onModifier}
            className="w-full py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            ✏️ Modifier
          </button>
          {rdv.statut !== 'ANNULE' && (
            <button
              onClick={() => action('annuler', () => annulerRdv(rdv.id))}
              disabled={enCours !== null}
              className="w-full py-2 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
              {enCours === 'annuler' ? 'En cours...' : 'Annuler le RDV'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
