export type StatutDemande =
  | 'CREEE'
  | 'VALIDEE'
  | 'PLANIFIEE'
  | 'EN_COURS'
  | 'EN_INTERPRETATION'
  | 'RESULTAT_DISPONIBLE'
  | 'ACK_RECU'
  | 'ANNULEE'

export type NiveauUrgence = 'STAT' | 'URGENTE' | 'NORMALE'

export type TypeEEG = 'STANDARD' | 'SOMMEIL' | 'AMBULATOIRE' | 'VIDEO_EEG'

export interface DemandeEEG {
  id: string
  numeroEEG: string
  patientId: string
  prescripteurId: string
  technicienId?: string
  typeEEG: TypeEEG
  urgence: NiveauUrgence
  motifPrescription: string
  statut: StatutDemande
  episodeSoinsId: string
  dateCreation: string
  dateRDV?: string
  dateRealisation?: string
  dateValidation?: string
  dateAck?: string
  motifAnnulation?: string
  patient?: import('./patient').Patient
  prescripteur?: import('./utilisateur').Utilisateur
  resultat?: import('./resultat').EegResultat
  rdv?: import('./rdv').RendezVousEEG
}

export interface WorklistData {
  aValider?: DemandeEEG[]
  aInterpreter?: DemandeEEG[]
  statUrgents?: DemandeEEG[]
  rdvDuJour?: DemandeEEG[]
  aPlanifier?: DemandeEEG[]
  aValiderCR?: DemandeEEG[]
  toutes?: DemandeEEG[]
}
