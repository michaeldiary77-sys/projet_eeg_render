'use client'

import { useEffect, useState, useCallback } from 'react'
import { getArchives } from '@/services/archives.service'
import ArchivesFiltresComponent from '@/components/archives/ArchivesFiltres'
import ArchivesTable from '@/components/archives/ArchivesTable'
import WorklistPagination from '@/components/worklist/WorklistPagination'
import type { EegResultat } from '@/types/eeg/resultat'
import type { ArchivesFiltres } from '@/types/eeg/archives'

export default function ArchivesPage() {
  const [resultats, setResultats] = useState<EegResultat[]>([])
  const [chargement, setChargement] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtres, setFiltres] = useState<ArchivesFiltres>({})

  const charger = useCallback(async (f: ArchivesFiltres, p: number) => {
    setChargement(true)
    try {
      const data = await getArchives({ ...f, page: p, limit: 20 })
      setResultats(data.data)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch {
      setResultats([])
    } finally {
      setChargement(false)
    }
  }, [])

  useEffect(() => {
    charger(filtres, page)
  }, [charger, filtres, page])

  const handleFiltres = useCallback((f: ArchivesFiltres) => {
    setFiltres(f)
    setPage(1)
  }, [])

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Archives EEG</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} résultat{total > 1 ? 's' : ''} validé{total > 1 ? 's' : ''}
        </p>
      </div>

      <ArchivesFiltresComponent onChangeFiltres={handleFiltres} />

      {chargement ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <ArchivesTable resultats={resultats} />
          <WorklistPagination
            page={page}
            totalPages={totalPages}
            onChangePage={setPage}
          />
        </>
      )}
    </div>
  )
}
