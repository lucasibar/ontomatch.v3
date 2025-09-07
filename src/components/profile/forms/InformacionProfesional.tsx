'use client'

import { ProfileFormData } from '@/shared/types/profile'
import { useState } from 'react'
import Select from '@/components/ui/Select'

interface InformacionProfesionalProps {
  formData: ProfileFormData
  handleInputChange: (field: keyof ProfileFormData, value: string | number) => void
  fieldErrors: Record<string, string>
}

// Lista de escuelas que ya existen en la base de datos
const ESCUELAS_COMUNES = [
  { id: 'fb51e0ff-0c9c-4b3f-9da7-5dec70b84d00', nombre: 'Escuela de Coaching Ontológico Argentina' },
  { id: '2d9e608e-cb27-4e56-9d2c-686883e59307', nombre: 'Instituto de Coaching Integral' },
  { id: 'd341bbc4-7da6-42a9-9ffa-1ff276c98e9f', nombre: 'Academia de Coaching Profesional' },
  { id: 'b653c96b-4935-490d-be14-45f0455e0341', nombre: 'Centro de Desarrollo Humano' },
  { id: '5361bbca-dd18-44ca-848f-32ef815d3bd3', nombre: 'Escuela de Liderazgo y Coaching' }
]

export default function InformacionProfesional({
  formData,
  handleInputChange,
  fieldErrors
}: InformacionProfesionalProps) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

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

          {/* Escuela de Coaching - Siempre visible pero se desplaza */}
          <div className={`transition-all duration-300 ease-in-out ${
            isAccordionOpen ? 'mt-8' : 'mt-0'
          }`}>
            <Select
              id="escuela_coaching"
              name="escuela_coaching"
              value={formData.escuela_coaching_id || ''}
              onChange={(value) => handleInputChange('escuela_coaching_id', value)}
              options={ESCUELAS_COMUNES}
              label="Escuela de Coaching"
              placeholder="Selecciona tu escuela de coaching"
              required
            />
            {fieldErrors.escuela_coaching_id && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.escuela_coaching_id}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
