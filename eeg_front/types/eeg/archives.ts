import type { EegResultat } from './resultat'

export interface ArchivesResponse {
  data: EegResultat[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ArchivesFiltres {
  patientId?: string
  numeroEEG?: string
  typeEEG?: string
  dateDebut?: string
  dateFin?: string
  conclusion?: string
  page?: number
  limit?: number
}
