export interface EegResultat {
  id: string
  demandeId: string
  fichierTracePath?: string
  nomFichierOriginal?: string
  dureeEnregistrement?: number
  rythmesDeFond?: string
  anomaliesDetectees?: string
  conclusionDiagnostique?: string
  compteRendu?: string
  medecinValidateurId?: string
  dateValidation?: string
  estImmutable: boolean
  estCritique: boolean
  version: number
  createdAt: string
  updatedAt: string
  medecinValidateur?: {
    nom: string
    prenom: string
    role: string
    numeroOrdre?: string
  }
  rectifications?: EegRectification[]
}

export interface EegRectification {
  id: string
  resultatId: string
  auteurId: string
  motif: string
  ancienCompteRendu?: string
  nouveauCompteRendu?: string
  ancienRythmesDeFond?: string
  nouveauRythmesDeFond?: string
  ancienAnomalies?: string
  nouveauAnomalies?: string
  ancienneConclusion?: string
  nouvelleConclusion?: string
  dateRectification: string
}
