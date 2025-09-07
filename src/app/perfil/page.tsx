'use client'

import { useProfileForm } from '@/features/profile/hooks/useProfileForm'
import { 
  InformacionBasica, 
  EstiloDeVida, 
  QueBusco, 
  InformacionProfesional, 
  Intereses
} from '@/components/profile/forms'

export default function PerfilPage() {
  const { 
    profile, // Ahora profile ya tiene todos los datos completos
    loading,
    handleSubmit
  } = useProfileForm()

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-violet-600 rounded-full flex items-center justify-center animate-spin mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando tu perfil...
          </h2>
          <p className="text-gray-600">
            Preparando tus datos para edición
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Completa tu información para encontrar tu match perfecto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {profile && (
            <>
              {/* Información Básica */}
              <InformacionBasica/>

              {/* Qué Busco */}
              <QueBusco />

              {/* Estilo de Vida */}
              <EstiloDeVida />

              {/* Intereses */}
              <Intereses />

              {/* Información Profesional */}
              <InformacionProfesional />
            </>
          )}

          {/* Botón de Guardar */}
          <div className="pt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Guardar y Activar Perfil
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
