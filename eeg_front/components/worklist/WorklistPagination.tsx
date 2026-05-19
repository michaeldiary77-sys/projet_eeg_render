'use client'

interface WorklistPaginationProps {
  page: number
  totalPages: number
  onChangePage: (page: number) => void
}

export default function WorklistPagination({
  page,
  totalPages,
  onChangePage,
}: WorklistPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onChangePage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Précédent
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className={`w-8 h-8 text-sm rounded-lg transition-colors ${
              p === page
                ? 'bg-[#6750a4] text-white font-bold'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChangePage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Suivant →
      </button>
    </div>
  )
}
