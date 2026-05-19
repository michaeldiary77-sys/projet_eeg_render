'use client'
import { Toaster } from 'sonner'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'inherit',
        },
      }}
    />
  )
}
