'use client'

export interface FiltresState {
  recherche: string
  statut: string
  urgence: string
  typeEEG: string
}

interface WorklistFiltresProps {
  filtres: FiltresState
  onChangeFiltres: (filtres: FiltresState) => void
}

export default function WorklistFiltres({ filtres, onChangeFiltres }: WorklistFiltresProps) {
  const update = (key: keyof FiltresState, value: string) => {
    onChangeFiltres({ ...filtres, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Recherche texte */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Patient, numéro EEG, prescripteur..."
            value={filtres.recherche}
            onChange={e => update('recherche', e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4] focus:border-transparent"
          />
        </div>

        {/* Filtre statut */}
        <select
          value={filtres.statut}
          onChange={e => update('statut', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
        >
          <option value="">Tous les statuts</option>
          <option value="CREEE">Créée</option>
            <option value="VALIDEE">Validée</option>
            <option value="PLANIFIEE">Planifiée</option>
            <option value="EN_INTERPRETATION">En interprétation</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="EN_COURS">En cours</option>
          <option value="RESULTAT_DISPONIBLE">Résultat disponible</option>
          <option value="ACK_RECU">ACK reçu</option>
          <option value="ANNULEE">Annulée</option>
        </select>

        {/* Filtre urgence */}
        <select
          value={filtres.urgence}
          onChange={e => update('urgence', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
        >
          <option value="">Toutes urgences</option>
          <option value="STAT">STAT</option>
          <option value="URGENTE">URGENTE</option>
          <option value="NORMALE">NORMALE</option>
        </select>

        {/* Filtre type EEG */}
        <select
          value={filtres.typeEEG}
          onChange={e => update('typeEEG', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
        >
          <option value="">Tous types EEG</option>
          <option value="STANDARD">Standard</option>
          <option value="SOMMEIL">Sommeil</option>
          <option value="AMBULATOIRE">Ambulatoire</option>
          <option value="VIDEO_EEG">Vidéo-EEG</option>
        </select>
      </div>
    </div>
  )
}
