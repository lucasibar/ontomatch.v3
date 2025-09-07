'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'

interface GenderSecondaryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (generoId: string) => void
  generoPrimarioId: string
  generoSecundarioActual?: string | null
}

export default function GenderSecondaryModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  generoPrimarioId,
  generoSecundarioActual 
}: GenderSecondaryModalProps) {
  const [generoSeleccionado, setGeneroSeleccionado] = useState<string | null>(null)
  
  // Obtener géneros secundarios desde Redux
  const { generosSecundarios } = useAppSelector((state) => state.generos)

  // Filtrar géneros secundarios según el género primario seleccionado
  const generosSecundariosFiltrados = useMemo(() => {
    if (!generoPrimarioId) return []
    return generosSecundarios.filter(g => g.genero_primario_id === generoPrimarioId)
  }, [generosSecundarios, generoPrimarioId])

  // Inicializar género seleccionado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setGeneroSeleccionado(generoSecundarioActual || null)
    }
  }, [isOpen, generoSecundarioActual])


  const handleSelect = (generoId: string) => {
    setGeneroSeleccionado(generoId)
  }

  const handleAccept = () => {
    if (generoSeleccionado) {
      onSelect(generoSeleccionado)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Selecciona tu género secundario
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {generosSecundariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600">No hay opciones disponibles</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generosSecundariosFiltrados.map((genero) => (
                <button
                  type="button"
                  key={genero.id}
                  onClick={() => handleSelect(genero.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                    generoSeleccionado === genero.id
                      ? 'border-violet-500 bg-violet-100 text-violet-900'
                      : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  <span className="font-medium">{genero.nombre}</span>
                  {generoSeleccionado === genero.id && (
                    <svg className="w-5 h-5 float-right text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={!generoSeleccionado}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              generoSeleccionado
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}