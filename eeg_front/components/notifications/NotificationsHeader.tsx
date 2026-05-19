'use client'

interface NotificationsHeaderProps {
  nonLues: number
  onToutLire: () => void
  enCours: boolean
}

export default function NotificationsHeader({
  nonLues,
  onToutLire,
  enCours,
}: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          {nonLues > 0
            ? `${nonLues} notification${nonLues > 1 ? 's' : ''} non lue${nonLues > 1 ? 's' : ''}`
            : 'Tout est lu'}
        </p>
      </div>

      {nonLues > 0 && (
        <button
          onClick={onToutLire}
          disabled={enCours}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {enCours ? (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : '✓'}
          Tout marquer comme lu
        </button>
      )}
    </div>
  )
}
