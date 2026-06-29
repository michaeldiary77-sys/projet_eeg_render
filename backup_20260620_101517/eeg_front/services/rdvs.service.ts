import api from '@/lib/axios'
import type { RendezVousEEG } from '@/types/eeg/rdv'

export const getRdvs = async (params?: {
  statut?: string
  dateDebut?: string
  dateFin?: string
  patientId?: string
}): Promise<RendezVousEEG[]> => {
  const response = await api.get('/eeg/rdvs', { params })
  return response.data
}

export const getRdvsSemaine = async (): Promise<RendezVousEEG[]> => {
  const response = await api.get('/eeg/rdvs/semaine')
  return response.data
}

export const getRdvsAujourdhui = async (): Promise<RendezVousEEG[]> => {
  const response = await api.get('/eeg/rdvs/today')
  return response.data
}

export const getRdvById = async (id: string): Promise<RendezVousEEG> => {
  const response = await api.get(`/eeg/rdvs/${id}`)
  return response.data
}

export const creerRdv = async (data: Partial<RendezVousEEG>): Promise<RendezVousEEG> => {
  const response = await api.post('/eeg/rdvs', data)
  return response.data
}

export const modifierRdv = async (id: string, data: Partial<RendezVousEEG>): Promise<RendezVousEEG> => {
  const response = await api.patch(`/eeg/rdvs/${id}`, data)
  return response.data
}

export const realiserRdv = async (id: string, technicienId?: string): Promise<RendezVousEEG> => {
  const response = await api.patch(`/eeg/rdvs/${id}/realiser`, { technicienId })
  return response.data
}

export const marquerNonRealise = async (id: string): Promise<RendezVousEEG> => {
  const response = await api.patch(`/eeg/rdvs/${id}/non-realise`)
  return response.data
}

export const annulerRdv = async (id: string): Promise<RendezVousEEG> => {
  const response = await api.patch(`/eeg/rdvs/${id}/annuler`)
  return response.data
}

export const supprimerRdv = async (id: string): Promise<void> => {
  await api.delete(`/eeg/rdvs/${id}`)
}
