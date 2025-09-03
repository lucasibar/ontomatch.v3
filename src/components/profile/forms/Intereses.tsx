'use client'

import { useIntereses } from '@/features/profile/hooks/useIntereses'
import { useState } from 'react'

export default function Intereses() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { 
    intereses,
    categorias,
    interesesSeleccionados, 
    loading, 
    error,
    handleToggleInteres,
    getInteresesPorCategoria,
    isInteresSeleccionado
  } = useIntereses()

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  // Función para obtener el nombre de la categoría en español
  const getCategoriaDisplayName = (categoriaNombre: string) => {
    const nombres: Record<string, string> = {
      'aire_libre': 'Aire Libre',
      'bienestar': 'Bienestar',
      'casa': 'Casa',
      'comida': 'Comida',
      'creatividad': 'Creatividad',
      'deportes': 'Deportes',
      'entretenimiento': 'Entretenimiento',
      'fans': 'Fans',
      'musica': 'Música',
      'redes': 'Redes Sociales',
      'salir': 'Salir',
      'valores': 'Valores',
      'videojuegos': 'Videojuegos'
    }
    
    return nombres[categoriaNombre] || categoriaNombre
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del acordeón */}
      <button
        onClick={toggleAccordion}
        className="w-full px-8 py-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
      >
        <h3 className="text-2xl font-semibold text-gray-900">Intereses</h3>
        <svg
          className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Contenido del acordeón */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 py-6 space-y-6 border-t border-gray-200">
          {/* Lista de categorías con intereses */}
          <div className="space-y-8">
            {categorias.map((categoria) => {
              const interesesCategoria = getInteresesPorCategoria(categoria.categoria_nombre)
              
              return (
                <div key={categoria.categoria_nombre} className="border border-gray-100 rounded-lg p-6">
                  {/* Header de la categoría */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {getCategoriaDisplayName(categoria.categoria_nombre)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {categoria.total_intereses} opciones disponibles
                    </p>
                  </div>

                  {/* Chips de intereses */}
                  <div className="flex flex-wrap gap-2">
                    {interesesCategoria.map((interes) => {
                      const isSelected = isInteresSeleccionado(interes.id)
                      const isDisabled = !isSelected && interesesSeleccionados.length >= 10
                      
                      return (
                        <button
                          key={interes.id}
                          onClick={() => handleToggleInteres(interes.id)}
                          disabled={isDisabled}
                          className={`
                            px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${isSelected 
                              ? 'bg-violet-600 text-white shadow-md hover:bg-violet-700' 
                              : isDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800'
                            }
                            ${isSelected ? 'ring-2 ring-violet-300' : ''}
                          `}
                          title={isDisabled ? 'Máximo de 10 intereses alcanzado' : ''}
                        >
                          {interes.nombre}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="px-8 py-4 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-violet-700 bg-violet-100 rounded-md">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando intereses...
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-8 py-4 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-red-700 bg-red-100 rounded-md">
              ❌ {error}
            </div>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay categorías */}
      {!loading && categorias.length === 0 && (
        <div className="px-8 py-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-gray-500">
              No se encontraron categorías de intereses
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
