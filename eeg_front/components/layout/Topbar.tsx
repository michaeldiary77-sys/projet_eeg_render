'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getNotificationsCount } from '@/services/notifications.service'
import type { RoleUtilisateur } from '@/types/eeg/utilisateur'

const ROLE_LABELS: Record<RoleUtilisateur, string> = {
  MEDECIN_SERVICE: 'Médecin de service',
  TECHNICIEN: 'Technicien',
  CHEF_SERVICE: 'Chef de service',
  MAJOR_SERVICE: 'Major de service',
}

export default function Topbar() {
  const { user, setRole } = useUser()
  const [nonLues, setNonLues] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getNotificationsCount()
        setNonLues(data.nonLues)
      } catch {}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6750a4] flex items-center justify-center">
          <span className="text-white text-xs font-bold">EEG</span>
        </div>
        <span className="font-semibold text-gray-800">CHU Andrainjato — Module EEG</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Sélecteur rôle simulé */}
        <select
          value={user.role}
          onChange={e => setRole(e.target.value as RoleUtilisateur)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-gray-50"
        >
          <option value="TECHNICIEN">Technicien</option>
          <option value="CHEF_SERVICE">Chef de service</option>
          <option value="MAJOR_SERVICE">Major de service</option>
          <option value="MEDECIN_SERVICE">Médecin de service</option>
        </select>

        {/* Badge notifications */}
        <div className="relative">
          <span className="text-xl">🔔</span>
          {nonLues > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {nonLues > 9 ? '9+' : nonLues}
            </span>
          )}
        </div>

        {/* Utilisateur */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#eaddff] flex items-center justify-center">
            <span className="text-[#6750a4] text-xs font-bold">
              {user.prenom[0]}{user.nom[0]}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">{user.prenom} {user.nom}</p>
            <p className="text-xs text-gray-400">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
