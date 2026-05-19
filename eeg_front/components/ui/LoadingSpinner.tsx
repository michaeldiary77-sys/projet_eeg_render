interface Props {
  taille?: 'sm' | 'md' | 'lg'
  message?: string
}

const TAILLES = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export default function LoadingSpinner({ taille = 'md', message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`animate-spin rounded-full border-b-2 border-[#6750a4] ${TAILLES[taille]}`}
      />
      {message && (
        <p className="text-sm text-gray-400">{message}</p>
      )}
    </div>
  )
}
