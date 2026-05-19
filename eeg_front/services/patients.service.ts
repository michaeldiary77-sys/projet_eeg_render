import api from '@/lib/axios'
import type { Patient } from '@/types/eeg/patient'

export const getPatients = async (search?: string): Promise<Patient[]> => {
  const response = await api.get('/eeg/patients', { params: search ? { search } : undefined })
  return response.data
}

export const getPatientById = async (id: string): Promise<Patient> => {
  const response = await api.get(`/eeg/patients/${id}`)
  return response.data
}

export const getPatientByDossier = async (idDossier: string): Promise<Patient> => {
  const response = await api.get(`/eeg/patients/dossier/${idDossier}`)
  return response.data
}

export const creerPatient = async (data: Omit<Patient, 'id' | '_count'>): Promise<Patient> => {
  const response = await api.post('/eeg/patients', data)
  return response.data
}

export const modifierPatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
  const response = await api.patch(`/eeg/patients/${id}`, data)
  return response.data
}
