'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { interpreterDemande, validerCR } from '@/services/demandes.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { DemandeEEG } from '@/types/eeg/demande'

interface TabCCompteRenduProps {
  demande: DemandeEEG
  onRefresh: () => void
}

export default function TabCCompteRendu({ demande, onRefresh }: TabCCompteRenduProps) {
  const { user } = useUser()
  const [rythmes, setRythmes] = useState(demande.resultat?.rythmesDeFond ?? '')
  const [anomalies, setAnomalies] = useState(demande.resultat?.anomaliesDetectees ?? '')
  const [conclusion, setConclusion] = useState(demande.resultat?.conclusionDiagnostique ?? '')
  const [compteRendu, setCompteRendu] = useState(demande.resultat?.compteRendu ?? '')
  const [confirmAction, setConfirmAction] = useState(false)
  const [enCours, setEnCours] = useState(false)

  const estMedecin = user.role === 'MEDECIN_SERVICE'
  const estChef = user.role === 'CHEF_SERVICE'
  const lectureSeule = user.role === 'TECHNICIEN' || user.role === 'MAJOR_SERVICE'

  const peutInterpreter = estMedecin && demande.statut === 'EN_COURS'
  const peutValiderCR = estChef && demande.statut === 'EN_INTERPRETATION'

  const handleInterpreter = async () => {
    setEnCours(true)
    try {
      await interpreterDemande(demande.id, {
        rythmesDeFond: rythmes,
        anomaliesDetectees: anomalies,
        conclusionDiagnostique: conclusion,
        compteRendu,
      })
      toast.success('Interprétation enregistrée ✅')
      setConfirmAction(false)
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  const handleValiderCR = async () => {
    setEnCours(true)
    try {
      await validerCR(demande.id)
      toast.success('Compte rendu validé ✅')
      setConfirmAction(false)
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-sm text-gray-500">Statut actuel :</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            demande.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-700' :
            demande.statut === 'EN_INTERPRETATION' ? 'bg-purple-100 text-purple-700' :
            demande.statut === 'RESULTAT_DISPONIBLE' ? 'bg-emerald-100 text-emerald-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {demande.statut}
          </span>
          {peutInterpreter && (
            <span className="text-xs text-blue-500 ml-auto">
              → Vous pouvez saisir et soumettre l'interprétation
            </span>
          )}
          {peutValiderCR && (
            <span className="text-xs text-purple-500 ml-auto">
              → Vous pouvez valider le compte rendu
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">📝 Compte rendu</h3>
          {[
            { label: 'Rythmes de fond', value: rythmes, setter: setRythmes },
            { label: 'Anomalies détectées', value: anomalies, setter: setAnomalies },
            { label: 'Conclusion diagnostique', value: conclusion, setter: setConclusion },
            { label: 'Compte rendu global', value: compteRendu, setter: setCompteRendu },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <textarea
                value={value}
                onChange={e => setter(e.target.value)}
                disabled={lectureSeule || (!peutInterpreter && !peutValiderCR)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] resize-none disabled:bg-gray-50 disabled:text-gray-500"
                placeholder={
                  lectureSeule ? '—' :
                  peutInterpreter ? `Saisir ${label.toLowerCase()}...` :
                  peutValiderCR ? `Réviser ${label.toLowerCase()}...` : '—'
                }
              />
            </div>
          ))}
        </div>

        {peutInterpreter && (
          <div className="flex justify-end">
            <button
              onClick={() => setConfirmAction(true)}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              📤 Soumettre l'interprétation
            </button>
          </div>
        )}

        {peutValiderCR && (
          <div className="flex justify-end">
            <button
              onClick={() => setConfirmAction(true)}
              className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              ✅ Valider le compte rendu
            </button>
          </div>
        )}

        {lectureSeule && (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              🔒 Lecture seule — votre rôle ne permet pas de modifier le compte rendu
            </p>
          </div>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {peutInterpreter ? "📤 Confirmer l'interprétation" : "✅ Confirmer la validation CR"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {peutInterpreter
                ? 'Le dossier passera en EN_INTERPRETATION et sera transmis au Chef de service.'
                : 'Le compte rendu sera validé et disponible pour le prescripteur.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={peutInterpreter ? handleInterpreter : handleValiderCR}
                disabled={enCours}
                className={`px-5 py-2 text-sm text-white font-semibold rounded-lg disabled:opacity-50 transition-colors ${
                  peutInterpreter ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {enCours ? 'En cours...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
