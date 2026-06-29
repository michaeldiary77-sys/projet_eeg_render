'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getWorklist } from '@/services/demandes.service'
import WorklistHeader from '@/components/worklist/WorklistHeader'
import WorklistFiltres, { type FiltresState } from '@/components/worklist/WorklistFiltres'
import WorklistTable from '@/components/worklist/WorklistTable'
import WorklistPagination from '@/components/worklist/WorklistPagination'
import type { DemandeEEG } from '@/types/eeg/demande'

const ITEMS_PAR_PAGE = 15

export default function WorklistPage() {
  const { user } = useUser()
  const [demandes, setDemandes] = useState<DemandeEEG[]>([])
  const [chargement, setChargement] = useState(true)
  const [page, setPage] = useState(1)
  const [filtres, setFiltres] = useState<FiltresState>({
    recherche: '',
    statut: '',
    urgence: '',
    typeEEG: '',
  })

  const charger = useCallback(async () => {
    if (!user?.role) return
    setChargement(true)
    try {
      const data = await getWorklist(user.role)
      
      // Transformer l'objet retourné en tableau selon le rôle
      let demandesArray: DemandeEEG[] = []
      
      if (user.role === 'MEDECIN_SERVICE') {
        demandesArray = [...(data.aValider || []), ...(data.aInterpreter || [])]
      } else if (user.role === 'TECHNICIEN') {
        demandesArray = [...(data.statUrgents || []), ...(data.rdvDuJour || [])]
      } else if (user.role === 'CHEF_SERVICE') {
        demandesArray = [...(data.aPlanifier || []), ...(data.aValiderCR || [])]
      } else if (user.role === 'MAJOR_SERVICE') {
        demandesArray = data.toutes || []
      } else {
        demandesArray = []
      }
      
      setDemandes(demandesArray)
      setPage(1)
    } catch (error) {
      console.error('Erreur chargement worklist:', error)
      setDemandes([])
    } finally {
      setChargement(false)
    }
  }, [user?.role])

  useEffect(() => {
    charger()
    const interval = setInterval(charger, 20000)
    return () => clearInterval(interval)
  }, [charger])

  const demandesFiltrees = useMemo(() => {
    if (!Array.isArray(demandes)) return []
    return demandes.filter(d => {
      const recherche = filtres.recherche.toLowerCase()
      if (recherche) {
        const nomPatient = d.patient
          ? `${d.patient.prenom} ${d.patient.nom}`.toLowerCase()
          : ''
        const nomPrescripteur = d.prescripteur
          ? `${d.prescripteur.nom}`.toLowerCase()
          : ''
        const matchRecherche =
          nomPatient.includes(recherche) ||
          d.numeroEEG.toLowerCase().includes(recherche) ||
          nomPrescripteur.includes(recherche)
        if (!matchRecherche) return false
      }
      if (filtres.statut && d.statut !== filtres.statut) return false
      if (filtres.urgence && d.urgence !== filtres.urgence) return false
      if (filtres.typeEEG && d.typeEEG !== filtres.typeEEG) return false
      return true
    })
  }, [demandes, filtres])

  const totalPages = Math.ceil(demandesFiltrees.length / ITEMS_PAR_PAGE)
  const demandesPage = demandesFiltrees.slice(
    (page - 1) * ITEMS_PAR_PAGE,
    page * ITEMS_PAR_PAGE
  )

  const nombreStat = (Array.isArray(demandes) ? demandes : []).filter(d => d.urgence === 'STAT' && d.statut !== 'ANNULEE').length
  const nombreUrgente = (Array.isArray(demandes) ? demandes : []).filter(d => d.urgence === 'URGENTE' && d.statut !== 'ANNULEE').length

  if (!user) return null

  return (
    <div className="space-y-6">
      <WorklistHeader
        total={demandesFiltrees.length}
        nombreStat={nombreStat}
        nombreUrgente={nombreUrgente}
        inclureTerminees={false}
        onToggleTerminees={() => {}}
      />

      <WorklistFiltres
        filtres={filtres}
        onChangeFiltres={f => { setFiltres(f); setPage(1) }}
      />

      {chargement ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <WorklistTable demandes={demandesPage} onRefresh={charger} />
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
