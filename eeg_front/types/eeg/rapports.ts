export interface RapportActivite {
  recues: number
  traitees: number
  annulees: number
  enAttente: number
}

export interface RapportDelais {
  delaiMoyenTraitementMinutes: number
  delaiMoyenAckMinutes: number
  nombreDemandes: number
}

export interface RapportAnomalie {
  id: string
  demandeId: string
  estCritique: boolean
  dateValidation?: string
  demande?: {
    numeroEEG: string
    statut: string
    patient?: {
      nom: string
      prenom: string
      idDossier: string
    }
    dateAck?: string
  }
}
