import api from '@/lib/axios'
import type { DemandeEEG, WorklistData } from '@/types/eeg/demande'

export const getWorklist = async (role?: string): Promise<WorklistData> => {
  const response = await api.get('/eeg/demandes/worklist', { params: { role } })
  return response.data
}

export const getDemandeById = async (id: string): Promise<DemandeEEG> => {
  const response = await api.get(`/eeg/demandes/${id}`)
  return response.data
}

export const getDemandesByPatient = async (patientId: string): Promise<DemandeEEG[]> => {
  const response = await api.get(`/eeg/demandes/patient/${patientId}`)
  return response.data
}

export const validerDemande = async (id: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/valider`)
  return response.data
}

export const refuserDemande = async (id: string, motif: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/refuser`, { motif })
  return response.data
}

export const annulerDemande = async (id: string, motif: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/annuler`, { motif })
  return response.data
}

export const planifierRdv = async (id: string, data: {
  dateRDV: string
  salle?: string
  heureDebut?: string
  heureFin?: string
  dureeMinutes?: number
  renseignementClinique?: string
}): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/planifier`, data)
  return response.data
}

export const realiserDemande = async (id: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/realiser`)
  return response.data
}

export const interpreterDemande = async (id: string, brouillon: any): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/interpreter`, brouillon)
  return response.data
}

export const validerCR = async (id: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/valider-cr`)
  return response.data
}

export const accuserReception = async (id: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/ack`)
  return response.data
}
