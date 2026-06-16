'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { uploadImageTrace } from '@/services/resultats.service'
import { realiserDemande } from '@/services/demandes.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { DemandeEEG } from '@/types/eeg/demande'

interface TabBRealisationProps {
  demande: DemandeEEG
  onRefresh: () => void
}

export default function TabBRealisation({ demande, onRefresh }: TabBRealisationProps) {
  const { user } = useUser()
  const [fichier, setFichier] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progression, setProgression] = useState(0)
  const [enCours, setEnCours] = useState(false)

  const lectureSeule = user.role === 'MEDECIN_SERVICE'
  const estTechnicien = user.role === 'TECHNICIEN'
  const resultat = demande.resultat
  const peutRealiser = demande.statut === 'PLANIFIEE' || (demande.statut === 'CREEE' && demande.urgence === 'STAT')
  const peutUploader = !resultat?.nomFichierImage

  const handleFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    
    // Validation format : PNG ou JPG uniquement (flow officiel)
    const formatsAcceptes = ['image/png', 'image/jpeg']
    if (!formatsAcceptes.includes(f.type)) {
      toast.error('Seuls les fichiers PNG ou JPG sont acceptés')
      return
    }
    // Taille max : 10 Mo (flow officiel)
    const tailleMax = 10 * 1024 * 1024
    if (f.size > tailleMax) {
      toast.error('Le fichier ne doit pas dépasser 10 Mo')
      return
    }
    setFichier(f)
  }

  const handleUpload = async () => {
    if (!fichier) return
    setUploading(true)
    setProgression(0)
    try {
      const interval = setInterval(() => {
        setProgression(p => Math.min(p + 10, 90))
      }, 200)
      // Upload simple : juste l'image (flow officiel)
      await uploadImageTrace(demande.id, fichier)
      clearInterval(interval)
      setProgression(100)
      toast.success('Image uploadée avec succès ✅')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setUploading(false)
    }
  }

  const handleRealiser = async () => {
    setEnCours(true)
    try {
      // Endpoint correct selon le flow officiel : PATCH /eeg/demandes/:id/realiser
      await realiserDemande(demande.id)
      toast.success('Examen marqué comme réalisé ✅')
      onRefresh()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Upload image */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📁 Image trace EEG</h3>

        {resultat?.nomFichierImage && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
            <span className="text-emerald-600 text-xl">✅</span>
            <div>
              <p className="text-sm font-medium text-emerald-700">Image déjà uploadée</p>
              <p className="text-xs text-emerald-600 font-mono">{resultat.nomFichierImage}</p>
            </div>
          </div>
        )}

        {!lectureSeule && peutUploader && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Image trace (PNG ou JPG, max 10 Mo) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFichier}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#eaddff] file:text-[#6750a4] hover:file:bg-[#d0bcff] cursor-pointer"
              />
              {fichier && (
                <p className="text-xs text-gray-500 mt-1">
                  📄 {fichier.name} ({(fichier.size / 1024 / 1024).toFixed(2)} Mo)
                </p>
              )}
            </div>

            {uploading && (
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#6750a4] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progression}%` }}
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!fichier || uploading}
              className="px-5 py-2.5 bg-[#6750a4] text-white text-sm font-semibold rounded-xl hover:bg-[#5a4490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? `Upload en cours... ${progression}%` : "⬆️ Uploader l'image"}
            </button>
          </div>
        )}
      </div>

      {/* Section Réaliser - TECHNICIEN uniquement */}
      {estTechnicien && peutRealiser && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">🔬 Réalisation de l'examen</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Statut actuel :</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              demande.statut === 'PLANIFIEE' ? 'bg-cyan-100 text-cyan-700' :
              demande.statut === 'CREEE' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {demande.statut}
            </span>
          </div>

          {resultat?.nomFichierImage ? (
            <p className="text-sm text-emerald-700 mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              ✅ Image uploadée. Vous pouvez maintenant marquer l'examen comme réalisé.
            </p>
          ) : (
            <p className="text-sm text-amber-700 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
              ⚠️ Vous devez d'abord uploader l'image trace avant de marquer l'examen comme réalisé.
            </p>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleRealiser}
              disabled={enCours || !resultat?.nomFichierImage}
              className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {enCours ? 'En cours...' : '✅ Marquer comme réalisé'}
            </button>
          </div>
        </div>
      )}

      {lectureSeule && (
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            🔒 Lecture seule — votre rôle ne permet pas de réaliser l'examen
          </p>
        </div>
      )}
    </div>
  )
}
