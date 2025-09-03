'use client'

import { useProfile } from '@/features/profile/hooks/useProfile'
import PostLoginRedirect from '@/components/auth/PostLoginRedirect'
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Componente que maneja la redirección post-login */}
      <PostLoginRedirect />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Completa tu información para encontrar tu match perfecto</p>
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
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Guardar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
