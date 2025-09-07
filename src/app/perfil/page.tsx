'use client'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { 
  InformacionBasica, 
  EstiloDeVida, 
  QueBusco, 
  InformacionProfesional, 
  Intereses
} from '@/components/profile/forms'

export default function PerfilPage() {
  const { 
    profile, 
    loading,
    handleInputChange, 
    generosPrimarios, 
    generosSecundarios, 
    ubicaciones,
    fieldErrors,
    handleSubmit 
  } = useProfile()

  // Convertir Profile a ProfileFormData
  const formData = profile ? {
    nombre_completo: profile.nombre_completo || '',
    descripcion: profile.descripcion || '',
    edad: profile.edad || 18,
    genero_primario_id: profile.genero_primario_id || '',
    genero_secundario_id: profile.genero_secundario_id || '',
    ubicacion_id: profile.ubicacion_id || '',
    que_busco_id: profile.que_busco_id || '',
    orientacion_sexual_id: profile.orientacion_sexual_id || '',
    edad_min: profile.edad_min || 18,
    edad_max: profile.edad_max || 65,
    distancia_maxima: profile.distancia_maxima || 20,
    escuela_coaching_id: profile.escuela_coaching_id || ''
  } : null

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
          {formData && (
            <>
              {/* Información Básica */}
              <InformacionBasica
                formData={formData}
                handleInputChange={handleInputChange}
                generosPrimarios={generosPrimarios}
                ubicaciones={ubicaciones}
                fieldErrors={fieldErrors}
              />

              {/* Qué Busco */}
              <QueBusco
                formData={formData}
                handleInputChange={handleInputChange}
                fieldErrors={fieldErrors}
              />

              {/* Estilo de Vida */}
              <EstiloDeVida />

              {/* Intereses */}
              <Intereses />

              {/* Información Profesional */}
              <InformacionProfesional
                formData={formData}
                handleInputChange={handleInputChange}
                fieldErrors={fieldErrors}
              />
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
