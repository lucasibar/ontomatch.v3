'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfileLocal } from '@/store/sliceProfile'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'

// Lista de escuelas que ya existen en la base de datos
const ESCUELAS_COMUNES = [
  { id: 'fb51e0ff-0c9c-4b3f-9da7-5dec70b84d00', nombre: 'Escuela de Coaching Ontológico Argentina' },
  { id: '2d9e608e-cb27-4e56-9d2c-686883e59307', nombre: 'Instituto de Coaching Integral' },
  { id: 'd341bbc4-7da6-42a9-9ffa-1ff276c98e9f', nombre: 'Academia de Coaching Profesional' },
  { id: 'b653c96b-4935-490d-be14-45f0455e0341', nombre: 'Centro de Desarrollo Humano' },
  { id: '5361bbca-dd18-44ca-848f-32ef815d3bd3', nombre: 'Escuela de Liderazgo y Coaching' }
]

interface InformacionProfesionalProps {
  validationErrors?: Record<string, string>
}

export default function InformacionProfesional({ validationErrors = {} }: InformacionProfesionalProps) {
  const dispatch = useAppDispatch()
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  
  // Estados de Redux
  const { profile } = useAppSelector((state) => state.profile)
  
  // Estado local del formulario - inicializado con datos de profile
  const [formData, setFormData] = useState({
    empresa: profile?.info_profesional?.empresa || '',
    cargo: profile?.info_profesional?.cargo || ''
  })

  // Actualizar estado local cuando cambie profile (solo si es necesario)
  useEffect(() => {
    if (profile.info_profesional) {
      setFormData(profile.info_profesional)
    }
  }, [profile.info_profesional])

  // Función para manejar cambios en empresa y cargo
  const handleInfoProfesionalChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData) // Actualizar estado local
    dispatch(updateProfileLocal({ info_profesional: newData })) // Actualizar Redux
  }

  // Función para manejar cambios en escuela_coaching_id
  const handleEscuelaChange = (value: string) => {
    dispatch(updateProfileLocal({ escuela_coaching_id: value }))
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

          {/* Campos de información profesional - Solo visibles cuando el acordeón está abierto */}
          {isAccordionOpen && (
            <div className="space-y-6">
              {/* Empresa */}
              <div>
                <Input
                  id="empresa"
                  name="empresa"
                  type="text"
                  value={formData.empresa || ''}
                  onChange={(e) => handleInfoProfesionalChange('empresa', e.target.value)}
                  label="Empresa"
                  placeholder="Ingresa el nombre de tu empresa"
                  required
                />
                {validationErrors.empresa && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.empresa}</p>
                )}
              </div>

              {/* Cargo */}
              <div>
                <Input
                  id="cargo"
                  name="cargo"
                  type="text"
                  value={formData.cargo || ''}
                  onChange={(e) => handleInfoProfesionalChange('cargo', e.target.value)}
                  label="Cargo"
                  placeholder="Ingresa tu cargo o posición"
                  required
                />
                {validationErrors.cargo && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.cargo}</p>
                )}
              </div>
            </div>
          )}

          {/* Escuela de Coaching - Siempre visible, se desplaza hacia abajo cuando se abre el acordeón */}
          <div className={`transition-all duration-300 ease-in-out ${
            isAccordionOpen ? 'mt-8' : 'mt-0'
          }`}>
            <Select
              id="escuela_coaching"
              name="escuela_coaching"
              value={profile.escuela_coaching_id || ''}
              onChange={handleEscuelaChange}
              options={ESCUELAS_COMUNES}
              label="Escuela de Coaching"
              placeholder="Selecciona tu escuela de coaching"
              required
            />
            {validationErrors.escuela_coaching_id && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.escuela_coaching_id}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
