'use client'

import { useEffect, useState, useCallback } from 'react'
import { getRdvsSemaine } from '@/services/rdvs.service'
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

export default function PlanningPage() {
  const [dateDebut, setDateDebut] = useState<Date>(() => getLundiSemaine(new Date()))
  const [rdvs, setRdvs] = useState<RendezVousEEG[]>([])
  const [chargement, setChargement] = useState(true)
  const [rdvSelectionne, setRdvSelectionne] = useState<RendezVousEEG | null>(null)
  const [showFormulaire, setShowFormulaire] = useState(false)
  const [rdvAModifier, setRdvAModifier] = useState<RendezVousEEG | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    try {
      const data = await getRdvsSemaine()
      setRdvs(data)
    } catch {
      setRdvs([])
    } finally {
      setChargement(false)
    }
  }, [])

  useEffect(() => {
    charger()
  }, [charger, dateDebut])

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
