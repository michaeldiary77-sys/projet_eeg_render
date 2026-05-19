export interface Patient {
  id: string
  nom: string
  prenom: string
  age: number
  sexe: 'M' | 'F'
  idDossier: string
  _count?: {
    demandes: number
    rdvs: number
  }
}
