import api from '@/lib/axios'
import type { EegAudit, ActionAudit } from '@/types/eeg/audit'

export const getAudit = async (params?: {
  patientId?: string
  demandeId?: string
  action?: ActionAudit
}): Promise<EegAudit[]> => {
  const response = await api.get('/eeg/audit', { params })
  return response.data
}
