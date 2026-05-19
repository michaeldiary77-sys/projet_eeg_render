'use client'
import { useUser } from '@/contexts/UserContext'
import type { RoleUtilisateur } from '@/types/eeg/utilisateur'

const ROLE_LABELS: Record<RoleUtilisateur, string> = {
  INTERNE: 'Interne',
  TECHNICIEN_EEG: 'Technicien EEG',
  NEUROLOGUE: 'Neurologue',
  MAJOR: 'Major',
}

const ORDRE_LABELS: Record<string, string> = {
  ONM: 'Ordre National des Médecins',
  ONIM: 'Ordre National des Infirmiers',
  ONSFM: 'Ordre National des Sages-Femmes',
  ONPM: 'Ordre National des Pharmaciens',
  AUTRE: 'Autre',
  AUCUN: 'Aucun',
}

export default function ProfilPage() {
  const { user } = useUser()

  const afficherOrdre = user.role === 'INTERNE' || user.role === 'NEUROLOGUE'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
        <p className="text-gray-400 text-sm mt-1">Informations du compte simulé</p>
      </div>

      {/* Avatar + rôle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#eaddff] flex items-center justify-center">
          <span className="text-[#6750a4] text-2xl font-bold">
            {user.prenom[0]}{user.nom[0]}
          </span>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{user.prenom} {user.nom}</p>
          <span className="inline-block mt-1 bg-[#eaddff] text-[#6750a4] text-xs font-semibold px-3 py-1 rounded-full">
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Informations personnelles</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Prénom</label>
              <p className="text-sm font-medium text-gray-800 mt-1">{user.prenom}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Nom</label>
              <p className="text-sm font-medium text-gray-800 mt-1">{user.nom}</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
            <p className="text-sm font-medium text-gray-800 mt-1">{user.email}</p>
          </div>
          {user.telephone && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Téléphone</label>
              <p className="text-sm font-medium text-gray-800 mt-1">{user.telephone}</p>
            </div>
          )}
          {user.matricule && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Matricule</label>
              <p className="text-sm font-medium text-gray-800 mt-1">{user.matricule}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ordre professionnel — INTERNE et NEUROLOGUE uniquement */}
      {afficherOrdre && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Ordre professionnel</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Ordre</label>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {ORDRE_LABELS[user.ordresProfessionnel] ?? user.ordresProfessionnel}
              </p>
            </div>
            {user.numeroOrdre && (
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Numéro d'ordre</label>
                <p className="text-sm font-mono font-medium text-gray-800 mt-1">{user.numeroOrdre}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Signature numérique</label>
              <div className="mt-1">
                {user.signatureNumerique ? (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                    <span>✓</span> Signature enregistrée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-yellow-600 text-sm font-medium">
                    <span>⚠️</span> Aucune signature numérique
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statut compte */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Statut du compte</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user.actif ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-700">
            {user.actif ? 'Compte actif' : 'Compte désactivé'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ⚠️ Mode simulation — authentification JWT à intégrer en Phase 2
        </p>
      </div>
    </div>
  )
}
