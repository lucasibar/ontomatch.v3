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
    formData, 
    handleInputChange, 
    generosPrimarios, 
    generosSecundarios, 
    ubicaciones,
    fieldErrors,
    hasAttemptedSubmit,
    isFormValid,
    handleSubmit 
  } = useProfile()

  // Calcular progreso del formulario
  const requiredFields = ['nombre_completo', 'genero_primario_id', 'ubicacion_id', 'escuela_coaching_id', 'que_busco_id', 'edad_min', 'edad_max', 'distancia_maxima']
  const completedFields = requiredFields.filter(field => {
    const value = formData[field as keyof typeof formData]
    return value && (typeof value === 'string' ? value.trim() !== '' : value !== 0)
  }).length
  const progressPercentage = (completedFields / requiredFields.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600 mt-2">Completa tu información para encontrar tu match perfecto</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-600">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-500">Completado</div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-violet-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {completedFields} de {requiredFields.length} campos obligatorios completados
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Información Básica */}
          <InformacionBasica
            formData={formData}
            handleInputChange={handleInputChange}
            generosPrimarios={generosPrimarios}
            ubicaciones={ubicaciones}
            fieldErrors={fieldErrors}
            hasAttemptedSubmit={hasAttemptedSubmit}
          />

          {/* Qué Busco */}
          <QueBusco
            formData={formData}
            handleInputChange={handleInputChange}
            fieldErrors={fieldErrors}
            hasAttemptedSubmit={hasAttemptedSubmit}
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
            hasAttemptedSubmit={hasAttemptedSubmit}
          />

          {/* Botón de Guardar */}
          <div className="pt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">¿Listo para guardar?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {progressPercentage === 100 
                      ? "¡Perfecto! Tu perfil está completo y listo para encontrar matches."
                      : `Completa el ${100 - Math.round(progressPercentage)}% restante para activar tu perfil.`
                    }
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={progressPercentage < 100}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    progressPercentage === 100
                      ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {progressPercentage === 100 ? 'Guardar y Activar Perfil' : 'Completar Campos Faltantes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
