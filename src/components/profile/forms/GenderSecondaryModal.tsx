'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { GeneroSecundario } from '@/shared/types/profile'
import { cn } from '@/shared/utils/cn'

interface GenderSecondaryModalProps {
  isOpen: boolean
  onClose: () => void
  generosSecundarios: GeneroSecundario[]
  selectedGeneroSecundario: string
  onSelectGeneroSecundario: (generoId: string) => void
  generoPrimarioNombre: string
}

export default function GenderSecondaryModal({
  isOpen,
  onClose,
  generosSecundarios,
  selectedGeneroSecundario,
  onSelectGeneroSecundario,
  generoPrimarioNombre
}: GenderSecondaryModalProps) {
  const [selectedId, setSelectedId] = useState(selectedGeneroSecundario)

  useEffect(() => {
    setSelectedId(selectedGeneroSecundario)
  }, [selectedGeneroSecundario])

  if (!isOpen) return null

  const handleConfirm = () => {
    onSelectGeneroSecundario(selectedId)
    onClose()
  }

  const handleOptionClick = (generoId: string) => {
    // Si ya está seleccionado, lo deselecciona
    if (selectedId === generoId) {
      setSelectedId('')
    } else {
      // Si no está seleccionado, lo selecciona
      setSelectedId(generoId)
    }
  }

  const handleCancel = () => {
    setSelectedId(selectedGeneroSecundario)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Género Secundario
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            suppressHydrationWarning={true}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {selectedGeneroSecundario && (
            <div className="mb-4 p-3 bg-violet-50 border border-violet-200 rounded-md">
              <p className="text-sm text-violet-700">
                <strong>Seleccionado:</strong> {generosSecundarios.find(g => g.id === selectedGeneroSecundario)?.nombre}
              </p>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {generosSecundarios.map((genero) => (
              <div
                key={genero.id}
                onClick={() => handleOptionClick(genero.id)}
                className={cn(
                  "flex items-center p-3 border rounded-lg cursor-pointer transition-colors",
                  selectedId === genero.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className={cn(
                  "mr-3 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                  selectedId === genero.id
                    ? "border-violet-500 bg-violet-500"
                    : "border-gray-300"
                )}>
                  {selectedId === genero.id && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {genero.nombre}
                </span>
              </div>
            ))}
          </div>

          {generosSecundarios.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay géneros secundarios disponibles para esta opción
            </p>
          )}


        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            suppressHydrationWarning={true}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedId}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            suppressHydrationWarning={true}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
