'use client'

import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import AppLayout from '@/components/layout/AppLayout'
import AppGuard from '@/components/auth/AppGuard'

// Mock data - después vendrá de Supabase
const mockProfiles = [
  {
    id: '1',
    nombre_completo: 'María González',
    edad: 25,
    descripcion: 'Me gusta viajar y conocer lugares nuevos. Amo los perros y la música indie.',
    fotos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face'
    ],
    ubicacion: 'Buenos Aires, Argentina',
    intereses: ['Viajes', 'Música', 'Fotografía', 'Cocina']
  },
  {
    id: '2',
    nombre_completo: 'Carlos Rodríguez',
    edad: 28,
    descripcion: 'Desarrollador de software, fanático del fútbol y la tecnología.',
    fotos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'
    ],
    ubicacion: 'Córdoba, Argentina',
    intereses: ['Tecnología', 'Fútbol', 'Programación', 'Videojuegos']
  },
  {
    id: '3',
    nombre_completo: 'Ana Martínez',
    edad: 26,
    descripcion: 'Psicóloga, amante de la naturaleza y los libros. Busco conexiones auténticas.',
    fotos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face'
    ],
    ubicacion: 'Rosario, Argentina',
    intereses: ['Psicología', 'Naturaleza', 'Lectura', 'Meditación']
  }
]

export default function SwipesPage() {
  const { profile } = useAppSelector((state) => state.profile)
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [profiles, setProfiles] = useState(mockProfiles)
  const [loading, setLoading] = useState(false)

  const currentProfile = profiles[currentProfileIndex]

  const handleSwipe = async (action: 'like' | 'dislike') => {
    if (!currentProfile) return

    setLoading(true)
    
    try {
      // Aquí irá la lógica para guardar el swipe en Supabase
      console.log(`${action} a ${currentProfile.nombre_completo}`)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Pasar al siguiente perfil
      setCurrentProfileIndex(prev => prev + 1)
    } catch (error) {
      console.error('Error al procesar swipe:', error)
    } finally {
      setLoading(false)
    }
  }

  // Si no hay más perfiles
  if (currentProfileIndex >= profiles.length) {
    return (
      <AppGuard>
        <AppLayout>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡No hay más perfiles!
              </h2>
              <p className="text-gray-600 mb-6">
                Has visto todos los perfiles disponibles por hoy. Vuelve mañana para descubrir más personas.
              </p>
              <button
                onClick={() => setCurrentProfileIndex(0)}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Ver de nuevo
              </button>
            </div>
          </div>
        </AppLayout>
      </AppGuard>
    )
  }

  return (
    <AppGuard>
      <AppLayout>
        <div className="min-h-screen p-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Descubrir</h1>
              <p className="text-gray-600">
                {currentProfileIndex + 1} de {profiles.length} perfiles
              </p>
            </div>

            {/* Profile Card */}
            {currentProfile && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                {/* Photo */}
                <div className="relative h-96">
                  <img
                    src={currentProfile.fotos[0]}
                    alt={currentProfile.nombre_completo}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Loading overlay */}
                  {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm">Procesando...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentProfile.nombre_completo}, {currentProfile.edad}
                    </h2>
                    <span className="text-gray-500 text-sm">
                      📍 {currentProfile.ubicacion}
                    </span>
                  </div>

                  {currentProfile.descripcion && (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {currentProfile.descripcion}
                    </p>
                  )}

                  {/* Interests */}
                  {currentProfile.intereses && currentProfile.intereses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Intereses</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.intereses.map((interes, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                          >
                            {interes}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-6">
              {/* Dislike Button */}
              <button
                onClick={() => handleSwipe('dislike')}
                disabled={loading}
                className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:border-red-400 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              >
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Like Button */}
              <button
                onClick={() => handleSwipe('like')}
                disabled={loading}
                className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200 disabled:opacity-50"
              >
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    </AppGuard>
  )
}