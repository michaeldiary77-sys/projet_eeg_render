import api from '@/lib/axios'
import type { Notification, NotificationCount } from '@/types/eeg/notification'

export const getNotifications = async (lu?: boolean): Promise<Notification[]> => {
  const response = await api.get('/eeg/notifications', {
    params: lu !== undefined ? { lu: String(lu) } : undefined,
  })
  return response.data
}

export const getNotificationsCount = async (): Promise<NotificationCount> => {
  const response = await api.get('/eeg/notifications/count')
  return response.data
}

export const marquerCommeLue = async (id: string): Promise<Notification> => {
  const response = await api.patch(`/eeg/notifications/${id}/lu`)
  return response.data
}

export const marquerToutesCommeLues = async (): Promise<{ message: string; count: number }> => {
  const response = await api.patch('/eeg/notifications/lire-tout')
  return response.data
}
