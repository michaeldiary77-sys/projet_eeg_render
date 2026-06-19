'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getRdvs } from '@/services/rdvs.service'
import PlanningToolbar from '@/components/planning/PlanningToolbar'
import CalendrierSemaine from '@/components/planning/CalendrierSemaine'
import PanneauDetailRDV from '@/components/planning/PanneauDetailRDV'
import FormulaireRDV from '@/components/planning/FormulaireRDV'
import type { RendezVousEEG } from '@/types/eeg/rdv'

function getLundiSemaine(date: Date): Date {
  const d = new Date(date)
  const jour = d.getDay()
  const diff = jour === 0 ? -6 : 1 - jour
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function PlanningPageContent() {
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')

  const [dateDebut, setDateDebut] = useState<Date>(() => {
    if (dateParam) {
      return getLundiSemaine(new Date(dateParam))
    }
    return getLundiSemaine(new Date())
  })
  const [rdvs, setRdvs] = useState<RendezVousEEG[]>([])
  const [chargement, setChargement] = useState(true)
  const [rdvSelectionne, setRdvSelectionne] = useState<RendezVousEEG | null>(null)
  const [showFormulaire, setShowFormulaire] = useState(false)
  const [rdvAModifier, setRdvAModifier] = useState<RendezVousEEG | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    try {
      // Calcule la fin de la semaine (dateDebut + 6 jours)
      const dateFin = new Date(dateDebut)
      dateFin.setDate(dateFin.getDate() + 6)
      
      const data = await getRdvs({
        dateDebut: dateDebut.toISOString().split('T')[0],
        dateFin: dateFin.toISOString().split('T')[0],
      })
      setRdvs(data)
    } catch {
      setRdvs([])
    } finally {
      setChargement(false)
    }
  }, [dateDebut])

  useEffect(() => {
    charger()
  }, [charger, dateDebut])

  // Auto-sélectionne le RDV correspondant à la demande planifiée
  useEffect(() => {
    const demandeId = searchParams.get('demandeId')
    if (demandeId && rdvs.length > 0) {
      const rdv = rdvs.find(r => r.demandeId === demandeId)
      if (rdv) setRdvSelectionne(rdv)
    }
  }, [rdvs, searchParams])

  const semainePrecedente = () => {
    setDateDebut(d => {
      const nd = new Date(d)
      nd.setDate(d.getDate() - 7)
      return nd
    })
    setRdvSelectionne(null)
  }

  const semaineSuivante = () => {
    setDateDebut(d => {
      const nd = new Date(d)
      nd.setDate(d.getDate() + 7)
      return nd
    })
    setRdvSelectionne(null)
  }

  return (
    <div className="space-y-6">
      <PlanningToolbar
        dateDebut={dateDebut}
        onSemainePrecedente={semainePrecedente}
        onSemaineSuivante={semaineSuivante}
        onNouveauRdv={() => { setRdvAModifier(null); setShowFormulaire(true) }}
      />

      {chargement ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={rdvSelectionne ? 'mr-80' : ''}>
          <CalendrierSemaine
            dateDebut={dateDebut}
            rdvs={rdvs}
            onSelectRdv={setRdvSelectionne}
          />
        </div>
      )}

      {rdvSelectionne && (
        <PanneauDetailRDV
          rdv={rdvSelectionne}
          onFermer={() => setRdvSelectionne(null)}
          onModifier={() => {
            setRdvAModifier(rdvSelectionne)
            setShowFormulaire(true)
          }}
          onRefresh={() => {
            charger()
            setRdvSelectionne(null)
          }}
        />
      )}

      {showFormulaire && (
        <FormulaireRDV
          rdv={rdvAModifier}
          onFermer={() => { setShowFormulaire(false); setRdvAModifier(null) }}
          onSuccess={charger}
        />
      )}
    </div>
  )
}

export default function PlanningPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PlanningPageContent />
    </Suspense>
  )
}
