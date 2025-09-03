'use client'

import { useEscuelasCoaching } from '@/features/profile/hooks/useEscuelasCoaching'
import { ProfileFormData } from '@/shared/types/profile'
import { useState, useRef, useEffect } from 'react'

interface InformacionProfesionalProps {
  formData: ProfileFormData
  handleInputChange: (field: keyof ProfileFormData, value: string | number) => void
  fieldErrors: Record<string, string>
}

export default function InformacionProfesional({ 
  formData,
  handleInputChange,
  fieldErrors
}: InformacionProfesionalProps) {
  const { 
    escuelasFiltradas, 
    escuelaSeleccionada, 
    searchTerm, 
    loading, 
    error, 
    isCreating,
    handleEscuelaSelect, 
    handleCrearEscuela, 
    handleSearchChange 
  } = useEscuelasCoaching()

  const [showDropdown, setShowDropdown] = useState(false)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Manejar selección de escuela
  const handleEscuelaClick = (escuela: any) => {
    handleEscuelaSelect(escuela)
    handleInputChange('escuela_coaching_id', escuela.id)
    setShowDropdown(false)
  }

  // Manejar creación de nueva escuela
  const handleCrearNuevaEscuela = () => {
    if (searchTerm.trim()) {
      handleCrearEscuela()
      setShowDropdown(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del acordeón */}
      <button
        type="button"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">
            Información Profesional
          </h3>
          <svg
            className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Contenido expandible del acordeón */}
      <div className={`px-8 transition-all duration-300 ease-in-out ${
        isAccordionOpen ? 'pb-8' : 'pb-6'
      }`}>
        <div className={`space-y-6 transition-all duration-300 ease-in-out ${
          isAccordionOpen ? 'opacity-100 max-h-screen' : 'opacity-100 max-h-32'
        }`}>
          {/* Campos adicionales que aparecen al expandir - ARRIBA */}
          {isAccordionOpen && (
            <div className="space-y-6">
              {/* Empresa */}
              <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <input
                  id="empresa"
                  type="text"
                  value={formData.empresa || ''}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              {/* Cargo */}
              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <input
                  id="cargo"
                  type="text"
                  value={formData.cargo || ''}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Tu cargo o puesto"
                />
              </div>
            </div>
          )}

          {/* Escuela de Coaching - Siempre visible pero se desplaza */}
          <div className={`transition-all duration-300 ease-in-out ${
            isAccordionOpen ? 'mt-8' : 'mt-0'
          }`}>
            <label htmlFor="escuela_coaching" className="block text-sm font-medium text-gray-700 mb-2">
              Escuela de Coaching <span className="text-red-500">*</span>
            </label>
            
            <div className="relative" ref={dropdownRef}>
              <input
                id="escuela_coaching"
                name="escuela_coaching"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  handleSearchChange(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  fieldErrors.escuela_coaching_id 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-violet-500'
                }`}
                placeholder="Busca tu escuela o escribe para crear una nueva"
                required
              />

              {/* Dropdown de opciones */}
              {showDropdown && (searchTerm || escuelasFiltradas.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Opciones existentes */}
                  {escuelasFiltradas.map((escuela) => (
                    <div
                      key={escuela.id}
                      onClick={() => handleEscuelaClick(escuela)}
                      className="px-3 py-2 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm text-gray-900">{escuela.nombre}</div>
                    </div>
                  ))}

                  {/* Opción para crear nueva */}
                  {searchTerm.trim() && !escuelasFiltradas.some(e => e.nombre.toLowerCase() === searchTerm.toLowerCase()) && (
                    <div
                      onClick={handleCrearNuevaEscuela}
                      className="px-3 py-2 hover:bg-green-50 cursor-pointer border-t border-gray-200 bg-green-50"
                    >
                      <div className="text-sm text-green-700 font-medium">
                        ✨ Crear: "{searchTerm}"
                      </div>
                    </div>
                  )}

                  {/* Mensaje si no hay opciones */}
                  {!searchTerm && escuelasFiltradas.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Escribe para buscar escuelas
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error de validación */}
            {fieldErrors.escuela_coaching_id && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.escuela_coaching_id}</p>
            )}

            {/* Escuela seleccionada */}
            {escuelaSeleccionada && (
              <div className="mt-2 p-2 bg-violet-50 border border-violet-200 rounded-md">
                <span className="text-sm text-violet-700">
                  Escuela seleccionada: <strong>{escuelaSeleccionada.nombre}</strong>
                </span>
              </div>
            )}

            {/* Estado de carga */}
            {loading && (
              <div className="mt-2 text-sm text-violet-600">
                Cargando escuelas...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-2 text-sm text-red-600">
                ❌ {error}
              </div>
            )}

            {/* Estado de creación */}
            {isCreating && (
              <div className="mt-2 text-sm text-green-600">
                Creando nueva escuela...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
