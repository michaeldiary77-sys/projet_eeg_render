export type StatutRdv = 'EN_ATTENTE' | 'REALISE' | 'NON_REALISE' | 'ANNULE'

export interface RendezVousEEG {
  id: string
  patientId: string
  prescripteurId: string
  demandeId?: string
  typeEEG: string
  salle: string
  priorite: import('./demande').NiveauUrgence
  statut: StatutRdv
  dateRdv: string
  heureDebut: string
  heureFin: string
  dureeMinutes: number
  renseignementClinique?: string
  dateRealisation?: string
  technicienRealisateurId?: string
  createdAt: string
  patient?: import('./patient').Patient
  prescripteur?: { nom: string; role: string }
  demande?: {
    numeroEEG: string
    statut: string
    urgence: string
    typeEEG: string
    motifPrescription?: string
  }
}
