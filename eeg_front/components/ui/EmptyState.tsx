interface Props {
  icone?: string
  titre: string
  message?: string
  action?: React.ReactNode
}

export default function EmptyState({ icone = '📭', titre, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icone}</span>
      <h3 className="text-lg font-semibold text-gray-700">{titre}</h3>
      {message && (
        <p className="text-sm text-gray-400 mt-1 max-w-sm">{message}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}
