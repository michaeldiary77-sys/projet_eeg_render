import api from '@/lib/axios'
import type { ArchivesResponse, ArchivesFiltres } from '@/types/eeg/archives'

export const getArchives = async (filtres?: ArchivesFiltres): Promise<ArchivesResponse> => {
  const response = await api.get('/eeg/archives', { params: filtres })
  return response.data
}
