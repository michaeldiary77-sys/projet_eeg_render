import api from '@/lib/axios'
import type { DemandeEEG } from '@/types/eeg/demande'

export const getWorklist = async (inclureTerminees = false): Promise<DemandeEEG[]> => {
  const response = await api.get('/eeg/demandes', {
    params: inclureTerminees ? { inclureTerminees: 'true' } : undefined,
  })
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

export const annulerDemande = async (id: string, motif: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/annuler`, { motif })
  return response.data
}

export const accuserReception = async (id: string): Promise<DemandeEEG> => {
  const response = await api.patch(`/eeg/demandes/${id}/ack`)
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
  const response = await api.patch(`/eeg/demandes/${id}/rdv`, data)
  return response.data
}
