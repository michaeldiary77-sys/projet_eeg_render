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
