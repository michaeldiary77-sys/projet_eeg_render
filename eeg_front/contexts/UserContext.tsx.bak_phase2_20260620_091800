'use client'
import { createContext, useContext, useState } from 'react'
import type { Utilisateur, RoleUtilisateur } from '@/types/eeg/utilisateur'

const UTILISATEURS_SIMULES: Record<RoleUtilisateur, Utilisateur> = {
  MEDECIN_SERVICE: {
    id: 'int-00000000-0000-0000-0000-000000000004',
    nom: 'Rasolo',
    prenom: 'Hery',
    email: 'hery.rasolo@chu-andrainjato.mg',
    role: 'MEDECIN_SERVICE',
    ordresProfessionnel: 'ONM',
    numeroOrdre: 'ONM-2024-0456',
    actif: true,
    createdAt: '',
    updatedAt: '',
  },
  TECHNICIEN: {
    id: 'tec-00000000-0000-0000-0000-000000000002',
    nom: 'Rakotomalala',
    prenom: 'Toky',
    email: 'toky.rakotomalala@chu-andrainjato.mg',
    role: 'TECHNICIEN',
    ordresProfessionnel: 'AUCUN',
    actif: true,
    createdAt: '',
    updatedAt: '',
  },
  CHEF_SERVICE: {
    id: 'med-00000000-0000-0000-0000-000000000001',
    nom: 'Raharison',
    prenom: 'Jean',
    email: 'jean.raharison@chu-andrainjato.mg',
    role: 'CHEF_SERVICE',
    ordresProfessionnel: 'ONM',
    numeroOrdre: 'ONM-2018-0123',
    actif: true,
    createdAt: '',
    updatedAt: '',
  },
  MAJOR_SERVICE: {
    id: 'maj-00000000-0000-0000-0000-000000000003',
    nom: 'Andrianasolo',
    prenom: 'Miora',
    email: 'miora.andrianasolo@chu-andrainjato.mg',
    role: 'MAJOR_SERVICE',
    ordresProfessionnel: 'AUCUN',
    actif: true,
    createdAt: '',
    updatedAt: '',
  },
}

interface UserContextType {
  user: Utilisateur
  setRole: (role: RoleUtilisateur) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Utilisateur>(UTILISATEURS_SIMULES.TECHNICIEN)

  const setRole = (role: RoleUtilisateur) => {
    setUser(UTILISATEURS_SIMULES[role])
  }

  return (
    <UserContext.Provider value={{ user, setRole }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser doit être utilisé dans UserProvider')
  return ctx
}
