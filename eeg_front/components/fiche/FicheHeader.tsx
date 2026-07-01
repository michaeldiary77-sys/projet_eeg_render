'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { accuserReception, planifierRdv } from '@/services/demandes.service'
import SlotPickerModal from '@/components/worklist/SlotPickerModal'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { DemandeEEG } from '@/types/eeg/demande'

interface FicheHeaderProps {
  demande: DemandeEEG
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
  ANNULEE: 'bg-gray-100 text-gray-400',
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

export default function FicheHeader({ demande, onRefresh }: FicheHeaderProps) {
  const { user } = useUser()
  const [enCours, setEnCours] = useState(false)
  const [showSlotPicker, setShowSlotPicker] = useState(false)

  const peutPlanifier =
    ['CREEE', 'EN_ATTENTE'].includes(demande.statut) &&
    ['CHEF_SERVICE', 'MAJOR_SERVICE'].includes(user.role) &&
    !demande.rdv

  const peutAck =
    demande.statut === 'RESULTAT_DISPONIBLE' &&
    (user.role === 'MEDECIN_SERVICE')

  const handleAck = async () => {
    setEnCours(true)
    try {
      await accuserReception(demande.id)
      toast.success('Accusé de réception enregistré')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  const handlePlanifier = async (slot: { dateRDV: string; heureDebut: string; salle: string }) => {
    await planifierRdv(demande.id, slot)
    toast.success('RDV planifié avec succès')
    setShowSlotPicker(false)
    onRefresh()
  }

  const patient = demande.patient
  const prescripteur = demande.prescripteur

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Infos patient */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">
              {patient ? `${patient.prenom} ${patient.nom}` : '—'}
            </h1>
            {patient && (
              <>
                <span className="text-sm text-gray-500">
                  {patient.age ? `${patient.age} ans` : 'Âge inconnu'}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  patient.sexe === 'M'
                    ? 'bg-blue-100 text-blue-700'
                    : patient.sexe === 'F'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {patient.sexe === 'M' ? '♂ Masculin' : patient.sexe === 'F' ? '♀ Féminin' : 'Sexe inconnu'}
                </span>
              </>
            )}
          </div>

          {patient && (
            <p className="text-sm text-gray-400 mt-1">
              📁 Dossier : <span className="font-mono font-medium">{patient.idDossier}</span>
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className="font-mono text-sm font-semibold text-gray-700">
              {demande.numeroEEG}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${URGENCE_BADGE[demande.urgence]}`}>
              {demande.urgence}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_BADGE[demande.statut]}`}>
              {STATUT_LABELS[demande.statut]}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-500 space-y-0.5">
            <p>
              📅 Créée le{' '}
              {new Date(demande.dateCreation).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {prescripteur && (
              <p>
                👨‍⚕️ Prescrit par{' '}
                <span className="font-medium text-gray-700">
                  Dr. {prescripteur.prenom} {prescripteur.nom}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {peutPlanifier && (
            <button
              onClick={() => setShowSlotPicker(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              📅 Planifier RDV
            </button>
          )}

          {/* Bouton ACK */}
          {peutAck && (
            <button
              onClick={handleAck}
              disabled={enCours}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#6750a4] text-white text-sm font-semibold rounded-xl hover:bg-[#5a4490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {enCours ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                '📬'
              )}
              Accuser réception
            </button>
          )}
        </div>
      </div>

      {showSlotPicker && (
        <SlotPickerModal
          demande={demande}
          onClose={() => setShowSlotPicker(false)}
          onConfirm={handlePlanifier}
        />
      )}
    </div>
  )
}
