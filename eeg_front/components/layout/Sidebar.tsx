'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import type { RoleUtilisateur } from '@/types/eeg/utilisateur'

interface NavItem {
  label: string
  href: string
  roles: RoleUtilisateur[]
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/eeg/dashboard', roles: ['TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '📊' },
  { label: 'File de travail', href: '/eeg/worklist', roles: ['TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '📋' },
  { label: 'Planning RDV', href: '/eeg/planning', roles: ['TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '📅' },
  { label: 'Archives EEG', href: '/eeg/archives', roles: ['INTERNE', 'TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '🗄️' },
  { label: 'Notifications', href: '/eeg/notifications', roles: ['INTERNE', 'TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '🔔' },
  { label: 'Patients', href: '/eeg/patients', roles: ['INTERNE', 'TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '👤' },
  { label: 'Rapports', href: '/eeg/rapports', roles: ['MAJOR'], icon: '📈' },
  { label: 'Mon Profil', href: '/eeg/profil', roles: ['INTERNE', 'TECHNICIEN_EEG', 'NEUROLOGUE', 'MAJOR'], icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const itemsFiltres = NAV_ITEMS.filter(item => item.roles.includes(user.role))

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="p-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {itemsFiltres.map(item => {
          const actif = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                actif
                  ? 'bg-[#eaddff] text-[#6750a4]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">SIH CHUA — Module EEG</p>
        <p className="text-xs text-gray-300">CHU Andrainjato</p>
      </div>
    </aside>
  )
}
