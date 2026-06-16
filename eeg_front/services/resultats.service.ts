import api from '@/lib/axios'
import type { EegResultat } from '@/types/eeg/resultat'

export const getResultatByDemande = async (demandeId: string): Promise<EegResultat> => {
  const response = await api.get(`/eeg/resultats/${demandeId}`)
  return response.data
}

export const uploadImageTrace = async (
  demandeId: string,
  fichier: File
): Promise<EegResultat> => {
  const formData = new FormData()
  formData.append('fichier', fichier)
  const response = await api.post(`/eeg/upload/image/${demandeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const uploadTrace = async (
  demandeId: string,
  fichier: File,
  data: { dureeEnregistrement?: number; compteRendu?: string; estCritique?: boolean }
): Promise<EegResultat> => {
  const formData = new FormData()
  formData.append('fichier', fichier)
  if (data.dureeEnregistrement) formData.append('dureeEnregistrement', String(data.dureeEnregistrement))
  if (data.compteRendu) formData.append('compteRendu', data.compteRendu)
  if (data.estCritique !== undefined) formData.append('estCritique', String(data.estCritique))
  const response = await api.post(`/eeg/upload/image/${demandeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const sauvegarderBrouillon = async (id: string, data: {
  rythmesDeFond?: string
  anomaliesDetectees?: string
  conclusionDiagnostique?: string
  compteRendu?: string
  estCritique?: boolean
}): Promise<EegResultat> => {
  const response = await api.patch(`/eeg/resultats/${id}/brouillon`, data)
  return response.data
}

export const validerResultat = async (id: string): Promise<EegResultat> => {
  const response = await api.patch(`/eeg/resultats/${id}/valider`)
  return response.data
}

export const rectifierResultat = async (id: string, data: {
  motif: string
  nouveauCompteRendu?: string
  nouveauRythmesDeFond?: string
  nouveauAnomalies?: string
  nouvelleConclusion?: string
}): Promise<EegResultat> => {
  const response = await api.post(`/eeg/resultats/${id}/rectifier`, data)
  return response.data
}
