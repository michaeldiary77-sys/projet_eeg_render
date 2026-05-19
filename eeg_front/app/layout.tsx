import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SIH CHUA — Module EEG',
  description: 'Système d\'Information Hospitalier — CHU Andrainjato Fianarantsoa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <UserProvider>
          {children}
          <Toaster position="top-right" richColors />
        </UserProvider>
      </body>
    </html>
  )
}
