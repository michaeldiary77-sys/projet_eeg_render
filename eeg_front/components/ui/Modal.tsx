'use client'
import { useEffect } from 'react'

interface Props {
  ouvert: boolean
  onFermer: () => void
  titre: string
  children: React.ReactNode
  largeur?: 'sm' | 'md' | 'lg' | 'xl'
}

const LARGEURS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export default function Modal({ ouvert, onFermer, titre, children, largeur = 'md' }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer()
    }
    if (ouvert) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [ouvert, onFermer])

  if (!ouvert) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onFermer}
      />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${LARGEURS[largeur]} mx-4 z-10`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{titre}</h2>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
