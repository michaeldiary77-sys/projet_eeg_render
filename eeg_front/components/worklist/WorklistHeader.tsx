'use client'

interface WorklistHeaderProps {
  total: number
  nombreStat: number
  nombreUrgente: number
  inclureTerminees: boolean
  onToggleTerminees: (val: boolean) => void
}

export default function WorklistHeader({
  total,
  nombreStat,
  nombreUrgente,
  inclureTerminees,
  onToggleTerminees,
}: WorklistHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">File de travail</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-gray-500">
            {total} demande{total > 1 ? 's' : ''}
          </span>
          {nombreStat > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
              🔴 {nombreStat} STAT
            </span>
          )}
          {nombreUrgente > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              🟠 {nombreUrgente} URGENTE
            </span>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => onToggleTerminees(!inclureTerminees)}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            inclureTerminees ? 'bg-[#6750a4]' : 'bg-gray-300'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            inclureTerminees ? 'translate-x-5' : 'translate-x-1'
          }`} />
        </div>
        <span className="text-sm text-gray-600">Inclure terminées</span>
      </label>
    </div>
  )
}
