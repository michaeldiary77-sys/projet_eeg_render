'use client'
import { useEffect, useState, useRef } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getNotifications } from '@/services/notifications.service'
import type { RoleUtilisateur } from '@/types/eeg/utilisateur'
import type { NiveauNotification } from '@/types/eeg/notification'

const ROLE_LABELS: Record<RoleUtilisateur, string> = {  
  MEDECIN_SERVICE: 'Médecin',
  TECHNICIEN: 'Technicien',
  CHEF_SERVICE: 'Chef de service',
  MAJOR_SERVICE: 'Major de service',
}

const playSound = (niveau: NiveauNotification) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    if (niveau === 'STAT') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5, high pitch
      gain.gain.setValueAtTime(0, ctx.currentTime)
      for (let i = 0; i < 3; i++) {
        const t = ctx.currentTime + i * 0.25
        gain.gain.setValueAtTime(1, t)
        gain.gain.setValueAtTime(0, t + 0.15)
      }
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } else if (niveau === 'URGENTE') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(660, ctx.currentTime) // E5
      gain.gain.setValueAtTime(0, ctx.currentTime)
      for (let i = 0; i < 2; i++) {
        const t = ctx.currentTime + i * 0.4
        gain.gain.setValueAtTime(0.8, t)
        gain.gain.setValueAtTime(0, t + 0.2)
      }
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.9)
    } else {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime) // A4
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    }
  } catch (err) {
    console.warn('AudioContext not allowed or not supported:', err)
  }
}

export default function Topbar() {
  const { user, setRole } = useUser()
  const [nonLues, setNonLues] = useState(0)
  const knownIdsRef = useRef<Set<string>>(new Set())
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const unread = await getNotifications(false)
        setNonLues(unread.length)
        
        if (isInitialLoad.current) {
          unread.forEach(n => knownIdsRef.current.add(n.id))
          isInitialLoad.current = false
          return
        }
        
        let highestNewUrgency: NiveauNotification | null = null
        
        unread.forEach(notif => {
          if (!knownIdsRef.current.has(notif.id)) {
            if (notif.niveau === 'STAT') {
              highestNewUrgency = 'STAT'
            } else if (notif.niveau === 'URGENTE' && highestNewUrgency !== 'STAT') {
              highestNewUrgency = 'URGENTE'
            } else if (notif.niveau === 'NORMALE' && !highestNewUrgency) {
              highestNewUrgency = 'NORMALE'
            }
            knownIdsRef.current.add(notif.id)
          }
        })
        
        const unreadIds = new Set(unread.map(n => n.id))
        for (const id of knownIdsRef.current) {
          if (!unreadIds.has(id)) {
            knownIdsRef.current.delete(id)
          }
        }

        if (highestNewUrgency) {
          playSound(highestNewUrgency)
        }
      } catch (err) {
        console.error('Erreur chargement notifications:', err)
      }
    }
    
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000) // Aligné sur le délai de notifications
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
  <option value="CHEF_SERVICE">Chef de service</option>
  <option value="TECHNICIEN">Technicien</option>
  <option value="MAJOR_SERVICE">Major de service</option>
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
