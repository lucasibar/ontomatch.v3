'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchFotos } from '@/store/sliceProfile'
import { useRouter } from 'next/navigation'

interface FotosPerfilProps {
  validationErrors?: Record<string, string>
}

export default function FotosPerfil({ validationErrors = {} }: FotosPerfilProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.profile)
  const { fotos, loading } = useAppSelector((state) => state.fotos)

  // Cargar fotos cuando se monta el componente
  useEffect(() => {
    if (profile?.id) {
      dispatch(fetchFotos(profile.id))
    }
  }, [dispatch, profile?.id])

  const handleEditFotos = () => {
    router.push('/perfil/fotos')
  }

  const primeraFoto = fotos.length > 0 ? fotos[0] : null
  const totalFotos = fotos.length
  const fotosRestantes = Math.max(0, 6 - totalFotos)

  return (
    <div className="relative">
      {/* Círculo grande flotante en el lado derecho, en el borde superior */}
      <div className="fixed top-0 right-8 z-50">
        <div className="relative">
          {/* Círculo principal */}
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
            {primeraFoto ? (
              <img
                src={primeraFoto.path}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-gray-400"
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
            )}
          </div>
          
          {/* Botón de editar en la esquina inferior derecha */}
          <button
            type="button"
            onClick={handleEditFotos}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
            title={totalFotos === 0 ? 'Agregar Fotos' : 'Editar Fotos'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          
          {/* Indicador de cantidad de fotos */}
          {totalFotos > 0 && (
            <div className="absolute -top-2 -left-2 bg-violet-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-medium shadow-lg">
              {totalFotos}
            </div>
          )}
        </div>
      </div>

      {/* Error de validación */}
      {validationErrors.fotos && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{validationErrors.fotos}</p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando fotos...
        </div>
      )}
    </div>
  )
}
