'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'
import ProfileGuard from '@/components/auth/ProfileGuard'
import Link from 'next/link'
import { useState } from 'react'

function SwipesContent() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Nombre del usuario */}
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-900">
                {profile?.nombre_completo || user?.email || 'Usuario'}
              </span>
            </div>

            {/* Título OntoMatch centrado */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold text-violet-600">
                OntoMatch
              </h1>
            </div>

            {/* Menú */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Abrir menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Dropdown del menú */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Editar Perfil
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              SWIPES
            </h2>
            <p className="text-lg text-gray-600">
              Ya tenés el form de perfil armado
            </p>
          </div>
        </div>
      </main>

      {/* Overlay para cerrar el menú al hacer click fuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default function SwipesPage() {
  return (
    <ProfileGuard>
      <SwipesContent />
    </ProfileGuard>
  )
}
