import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  statusCode: number
  erreur: string
  message: string
}

export function handleApiError(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message
  }
  if (axiosError.message) return axiosError.message
  return 'Une erreur inattendue est survenue'
}
