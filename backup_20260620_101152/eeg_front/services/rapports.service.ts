import api from '@/lib/axios'
import type { RapportActivite, RapportDelais } from '@/types/eeg/rapports'

export const getRapportActivite = async (): Promise<RapportActivite> => {
  const response = await api.get('/eeg/rapports/activite')
  return response.data
}

export const getRapportDelais = async (): Promise<RapportDelais> => {
  const response = await api.get('/eeg/rapports/delais')
  return response.data
}

export const getRapportAnomalies = async (): Promise<unknown[]> => {
  const response = await api.get('/eeg/rapports/anomalies')
  return response.data
}
