export type RoleUtilisateur = 'MEDECIN_SERVICE' | 'TECHNICIEN' | 'CHEF_SERVICE' | 'MAJOR_SERVICE'
export type OrdreProfessionnel = 'ONM' | 'ONIM' | 'ONSFM' | 'ONPM' | 'AUTRE' | 'AUCUN'

export interface Utilisateur {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  matricule?: string
  role: RoleUtilisateur
  ordresProfessionnel: OrdreProfessionnel
  numeroOrdre?: string
  signatureNumerique?: string
  actif: boolean
  createdAt: string
  updatedAt: string
}
