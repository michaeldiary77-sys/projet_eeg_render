'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getResultatByDemande, sauvegarderBrouillon, validerResultat, rectifierResultat } from '@/services/resultats.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { EegResultat } from '@/types/eeg/resultat'
import type { DemandeEEG } from '@/types/eeg/demande'

interface TabCCompteRenduProps {
  demande: DemandeEEG
  onRefresh: () => void
}

export default function TabCCompteRendu({ demande, onRefresh }: TabCCompteRenduProps) {
  const { user } = useUser()
  const [resultat, setResultat] = useState<EegResultat | null>(demande.resultat ?? null)
  const [rythmes, setRythmes] = useState(demande.resultat?.rythmesDeFond ?? '')
  const [anomalies, setAnomalies] = useState(demande.resultat?.anomaliesDetectees ?? '')
  const [conclusion, setConclusion] = useState(demande.resultat?.conclusionDiagnostique ?? '')
  const [compteRendu, setCompteRendu] = useState(demande.resultat?.compteRendu ?? '')
  const [estCritique, setEstCritique] = useState(demande.resultat?.estCritique ?? false)
  const [derniereSauvegarde, setDerniereSauvegarde] = useState<Date | null>(null)
  const [modifie, setModifie] = useState(false)
  const [confirmValidation, setConfirmValidation] = useState(false)
  const [showRectification, setShowRectification] = useState(false)
  const [motifRectif, setMotifRectif] = useState('')
  const [enCours, setEnCours] = useState(false)

  const peutSaisir =
    (user.role === 'NEUROLOGUE' || user.role === 'INTERNE') &&
    resultat &&
    !resultat.estImmutable
  const lectureSeule = user.role === 'TECHNICIEN_EEG' || user.role === 'MAJOR' || (resultat?.estImmutable ?? false)

  // Charger résultat si pas déjà dans demande
  useEffect(() => {
    if (!demande.resultat) {
      getResultatByDemande(demande.id)
        .then(r => {
          setResultat(r)
          setRythmes(r.rythmesDeFond ?? '')
          setAnomalies(r.anomaliesDetectees ?? '')
          setConclusion(r.conclusionDiagnostique ?? '')
          setCompteRendu(r.compteRendu ?? '')
          setEstCritique(r.estCritique)
        })
        .catch(() => {})
    }
  }, [demande.id, demande.resultat])

  // Autosauvegarde toutes les 2 minutes
  const sauvegarder = useCallback(async () => {
    if (!resultat || !modifie || resultat.estImmutable) return
    try {
      await sauvegarderBrouillon(resultat.id, {
        rythmesDeFond: rythmes,
        anomaliesDetectees: anomalies,
        conclusionDiagnostique: conclusion,
        compteRendu,
        estCritique,
      })
      setDerniereSauvegarde(new Date())
      setModifie(false)
    } catch {}
  }, [resultat, modifie, rythmes, anomalies, conclusion, compteRendu, estCritique])

  useEffect(() => {
    const interval = setInterval(sauvegarder, 120000)
    return () => clearInterval(interval)
  }, [sauvegarder])

  const handleValider = async () => {
    if (!resultat) return
    setEnCours(true)
    try {
      await validerResultat(resultat.id)
      toast.success('Résultat validé et signé avec succès')
      setConfirmValidation(false)
      onRefresh()
    } catch (error) {
      const msg = handleApiError(error)
      if (msg.includes('409') || msg.includes('modifié')) {
        toast.error('Ce résultat a été modifié entre-temps, veuillez recharger la page')
      } else {
        toast.error(msg)
      }
    } finally {
      setEnCours(false)
    }
  }

  const handleRectifier = async () => {
    if (!resultat || !motifRectif.trim()) return
    setEnCours(true)
    try {
      await rectifierResultat(resultat.id, { motif: motifRectif.trim() })
      toast.success('Rectification enregistrée')
      setShowRectification(false)
      setMotifRectif('')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  if (!resultat) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-4xl mb-3">📄</p>
        <p className="text-gray-500 font-medium">Aucun résultat disponible</p>
        <p className="text-gray-400 text-sm mt-1">Le fichier EDF doit être uploadé d'abord</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Indicateur sauvegarde */}
        {peutSaisir && (
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {modifie ? (
                <span className="text-amber-500">● Modifications non sauvegardées</span>
              ) : derniereSauvegarde ? (
                <span className="text-emerald-500">
                  ✓ Sauvegardé à {derniereSauvegarde.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              ) : null}
            </div>
            <button
              onClick={sauvegarder}
              disabled={!modifie}
              className="text-xs text-[#6750a4] hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              💾 Sauvegarder maintenant
            </button>
          </div>
        )}

        {/* Immutable badge */}
        {resultat.estImmutable && (
          <div className="flex items-center gap-2 p-3 bg-violet-50 rounded-lg border border-violet-200">
            <span className="text-violet-600">🔒</span>
            <p className="text-sm text-violet-700 font-medium">
              Résultat validé — lecture seule
            </p>
            {resultat.medecinValidateur && (
              <p className="text-xs text-violet-500 ml-auto">
                Par Dr. {resultat.medecinValidateur.nom} le{' '}
                {resultat.dateValidation
                  ? new Date(resultat.dateValidation).toLocaleDateString('fr-FR')
                  : '—'}
              </p>
            )}
          </div>
        )}

        {/* Champs compte rendu */}
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
                onChange={e => { setter(e.target.value); setModifie(true) }}
                disabled={!!lectureSeule}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] resize-none disabled:bg-gray-50 disabled:text-gray-500"
                placeholder={lectureSeule ? '—' : `Saisir ${label.toLowerCase()}...`}
              />
            </div>
          ))}

          {!lectureSeule && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="critique-cr"
                checked={estCritique}
                onChange={e => { setEstCritique(e.target.checked); setModifie(true) }}
                className="w-4 h-4 accent-[#6750a4]"
              />
              <label htmlFor="critique-cr" className="text-sm text-gray-700 cursor-pointer">
                🚨 Résultat critique — déclenche une alerte immédiate
              </label>
            </div>
          )}
        </div>

        {/* Boutons action */}
        {peutSaisir && (
          <div className="flex justify-end">
            <button
              onClick={() => setConfirmValidation(true)}
              className="px-6 py-2.5 bg-[#6750a4] text-white text-sm font-semibold rounded-xl hover:bg-[#5a4490] transition-colors shadow-sm"
            >
              ✅ Valider et signer
            </button>
          </div>
        )}

        {/* Bouton rectification */}
        {resultat.estImmutable && (user.role === 'NEUROLOGUE' || user.role === 'INTERNE') && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowRectification(true)}
              className="px-5 py-2.5 border border-amber-400 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-colors"
            >
              ✏️ Rectifier
            </button>
          </div>
        )}

        {/* Historique rectifications */}
        {resultat.rectifications && resultat.rectifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              🕒 Historique des rectifications ({resultat.rectifications.length})
            </h3>
            <ul className="divide-y divide-gray-50">
              {resultat.rectifications.map(r => (
                <li key={r.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-600">Rectification</span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.dateRectification).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
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

      {/* Modal confirmation validation */}
      {confirmValidation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚠️ Validation irréversible</h3>
            <p className="text-sm text-gray-600 mb-6">
              Une fois validé, ce résultat sera <strong>signé et verrouillé</strong> définitivement.
              Toute modification ultérieure nécessitera une rectification avec motif obligatoire.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmValidation(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleValider}
                disabled={enCours}
                className="px-5 py-2 text-sm bg-[#6750a4] text-white font-semibold rounded-lg hover:bg-[#5a4490] disabled:opacity-50 transition-colors"
              >
                {enCours ? 'Validation...' : 'Confirmer la validation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal rectification */}
      {showRectification && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">✏️ Rectifier le résultat</h3>
            <p className="text-sm text-gray-500 mb-4">Le motif de rectification est obligatoire.</p>
            <textarea
              value={motifRectif}
              onChange={e => setMotifRectif(e.target.value)}
              placeholder="Motif de rectification..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] resize-none"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => { setShowRectification(false); setMotifRectif('') }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRectifier}
                disabled={!motifRectif.trim() || enCours}
                className="px-5 py-2 text-sm bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {enCours ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
