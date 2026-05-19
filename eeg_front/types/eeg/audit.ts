export type ActionAudit =
  | 'CREATION'
  | 'CONSULTATION'
  | 'MODIFICATION'
  | 'VALIDATION'
  | 'ANNULATION'
  | 'IMPRESSION'
  | 'ACK'

export interface EegAudit {
  id: string
  utilisateurId: string
  role: string
  action: ActionAudit
  entite: string
  entiteId: string
  patientId: string
  detail?: Record<string, unknown>
  dateAction: string
  demandeId?: string
}
