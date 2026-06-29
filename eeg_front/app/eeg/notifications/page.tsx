'use client'

import { useEffect, useState, useCallback } from 'react'
import { getNotifications, marquerToutesCommeLues } from '@/services/notifications.service'
import { handleApiError } from '@/lib/handleApiError'
import { toast } from 'sonner'
import NotificationsHeader from '@/components/notifications/NotificationsHeader'
import ResumeNotifications from '@/components/notifications/ResumeNotifications'
import FilNotifications from '@/components/notifications/FilNotifications'
import type { Notification } from '@/types/eeg/notification'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [chargement, setChargement] = useState(true)
  const [enCours, setEnCours] = useState(false)

  const charger = useCallback(async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch {
      setNotifications([])
    } finally {
      setChargement(false)
    }
  }, [])

  useEffect(() => {
    charger()
    const interval = setInterval(charger, 15000)
    return () => clearInterval(interval)
  }, [charger])

  const handleToutLire = async () => {
    setEnCours(true)
    try {
      const result = await marquerToutesCommeLues()
      toast.success(`${result.count} notification${result.count > 1 ? 's' : ''} marquée${result.count > 1 ? 's' : ''} comme lue${result.count > 1 ? 's' : ''}`)
      charger()
    } catch (error) {
      toast.error(handleApiError(error))
    } finally {
      setEnCours(false)
    }
  }

  const nonLues = notifications.filter(n => !n.lu).length

  return (
    <div className="space-y-6">
      <NotificationsHeader
        nonLues={nonLues}
        onToutLire={handleToutLire}
        enCours={enCours}
      />

      <ResumeNotifications notifications={notifications} />

      {chargement ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#6750a4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <FilNotifications
          notifications={notifications}
          onRefresh={charger}
        />
      )}
    </div>
  )
}
