export type TypeNotification = 'ALERTE_CRITIQUE' | 'ALERTE_URGENTE' | 'RAPPORT' | 'SYSTEME'
export type NiveauNotification = 'STAT' | 'URGENTE' | 'NORMALE'

export interface NotificationAction {
  id: string
  label: string
  style: 'primary' | 'secondary'
  ordre: number
}

export interface Notification {
  id: string
  niveau: NiveauNotification
  type: TypeNotification
  titre: string
  message: string
  patientId?: string
  patientTexte?: string
  horodatage: string
  lu: boolean
  dateLecture?: string
  assigneeUserId?: string
  rdvId?: string
  demandeId?: string
  patient?: { id: string; nom: string; prenom: string }
  actions?: NotificationAction[]
}

export interface NotificationCount {
  total: number
  nonLues: number
}
