'use client'

import { useState, useEffect } from 'react'
import { getPatients } from '@/services/patients.service'
import { creerRdv, modifierRdv } from '@/services/rdvs.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import type { RendezVousEEG } from '@/types/eeg/rdv'
import type { Patient } from '@/types/eeg/patient'
import { useUser } from '@/contexts/UserContext'

interface FormulaireRDVProps {
  rdv?: RendezVousEEG | null
  onFermer: () => void
  onSuccess: () => void
}

const TYPES_EEG = ['STANDARD', 'SOMMEIL', 'AMBULATOIRE', 'VIDEO_EEG']
const SALLES = ['Salle EEG 1', 'Salle EEG 2', 'Salle EEG 3']
const PRIORITES = ['STAT', 'URGENTE', 'NORMALE']

export default function FormulaireRDV({ rdv, onFermer, onSuccess }: FormulaireRDVProps) {
  const { user } = useUser()
  const [patients, setPatients] = useState<Patient[]>([])
  const [recherche, setRecherche] = useState('')
  const [enCours, setEnCours] = useState(false)

  const [form, setForm] = useState({
    patientId: rdv?.patientId ?? '',
    typeEEG: rdv?.typeEEG ?? 'STANDARD',
    salle: rdv?.salle ?? 'Salle EEG 1',
    priorite: rdv?.priorite ?? 'NORMALE',
    dateRdv: rdv?.dateRdv ? rdv.dateRdv.split('T')[0] : '',
    heureDebut: rdv?.heureDebut ?? '08:00',
    heureFin: rdv?.heureFin ?? '09:00',
    dureeMinutes: rdv?.dureeMinutes ?? 60,
    renseignementClinique: rdv?.renseignementClinique ?? '',
  })

  useEffect(() => {
    getPatients(recherche || undefined)
      .then(setPatients)
      .catch(() => {})
  }, [recherche])

  const update = (key: string, value: unknown) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.patientId || !form.dateRdv) {
      toast.error('Patient et date sont obligatoires')
      return
    }
    setEnCours(true)
    try {
      const payload = {
        ...form,
        prescripteurId: user.id,
        dateRdv: new Date(form.dateRdv).toISOString(),
      }
      if (rdv) {
        await modifierRdv(rdv.id, payload)
        toast.success('RDV modifié avec succès')
      } else {
        await creerRdv(payload)
        toast.success('RDV créé avec succès')
      }
      onSuccess()
      onFermer()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {rdv ? '✏️ Modifier le RDV' : '+ Nouveau RDV'}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Recherche patient */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Patient <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] mb-2"
            />
            <select
              value={form.patientId}
              onChange={e => update('patientId', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.prenom} {p.nom} — {p.idDossier}
                </option>
              ))}
            </select>
          </div>

          {/* Type EEG + Salle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Type EEG</label>
              <select
                value={form.typeEEG}
                onChange={e => update('typeEEG', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              >
                {TYPES_EEG.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Salle</label>
              <select
                value={form.salle}
                onChange={e => update('salle', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              >
                {SALLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Priorité + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Priorité</label>
              <select
                value={form.priorite}
                onChange={e => update('priorite', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              >
                {PRIORITES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.dateRdv}
                onChange={e => update('dateRdv', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              />
            </div>
          </div>

          {/* Heures + Durée */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Début</label>
              <input
                type="time"
                value={form.heureDebut}
                onChange={e => update('heureDebut', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Fin</label>
              <input
                type="time"
                value={form.heureFin}
                onChange={e => update('heureFin', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Durée (min)</label>
              <input
                type="number"
                value={form.dureeMinutes}
                onChange={e => update('dureeMinutes', parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              />
            </div>
          </div>

          {/* Renseignement clinique */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Renseignement clinique
            </label>
            <textarea
              value={form.renseignementClinique}
              onChange={e => update('renseignementClinique', e.target.value)}
              rows={2}
              placeholder="Informations cliniques complémentaires..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750a4] resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onFermer}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={enCours}
            className="px-5 py-2 text-sm bg-[#6750a4] text-white font-semibold rounded-lg hover:bg-[#5a4490] disabled:opacity-50 transition-colors"
          >
            {enCours ? 'Enregistrement...' : rdv ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  )
}
