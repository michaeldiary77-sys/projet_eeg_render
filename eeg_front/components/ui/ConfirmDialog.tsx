'use client'
import Modal from './Modal'

interface Props {
  ouvert: boolean
  onFermer: () => void
  onConfirmer: () => void
  titre: string
  message: string
  labelConfirmer?: string
  labelAnnuler?: string
  variante?: 'danger' | 'warning' | 'primary'
  chargement?: boolean
}

const VARIANTES = {
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  primary: 'bg-[#6750a4] hover:bg-[#5a4590] text-white',
}

export default function ConfirmDialog({
  ouvert,
  onFermer,
  onConfirmer,
  titre,
  message,
  labelConfirmer = 'Confirmer',
  labelAnnuler = 'Annuler',
  variante = 'primary',
  chargement = false,
}: Props) {
  return (
    <Modal ouvert={ouvert} onFermer={onFermer} titre={titre} largeur="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onFermer}
            disabled={chargement}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {labelAnnuler}
          </button>
          <button
            onClick={onConfirmer}
            disabled={chargement}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${VARIANTES[variante]}`}
          >
            {chargement ? 'En cours...' : labelConfirmer}
          </button>
        </div>
      </div>
    </Modal>
  )
}
