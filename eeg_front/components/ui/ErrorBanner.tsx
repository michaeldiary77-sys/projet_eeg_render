interface Props {
  message: string
  onReessayer?: () => void
}

export default function ErrorBanner({ message, onReessayer }: Props) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <span className="text-red-500 text-xl">⚠️</span>
      <p className="text-sm text-red-700 flex-1">{message}</p>
      {onReessayer && (
        <button
          onClick={onReessayer}
          className="text-xs font-medium text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
