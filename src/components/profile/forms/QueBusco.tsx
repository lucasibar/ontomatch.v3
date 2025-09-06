'use client'

import { useQueBusco } from '@/features/profile/hooks/useQueBusco'
import Select from '@/components/ui/Select'
import RangeSlider from '@/components/ui/RangeSlider'
import { ProfileFormData } from '@/shared/types/profile'

interface QueBuscoProps {
  formData: ProfileFormData
  handleInputChange: (field: keyof ProfileFormData, value: string | number) => void
  fieldErrors: Record<string, string>
  hasAttemptedSubmit: boolean
}

export default function QueBusco({ 
  formData,
  handleInputChange,
  fieldErrors,
  hasAttemptedSubmit
}: QueBuscoProps) {
  const { opcionesQueBusco, loading, error } = useQueBusco()

  // Opciones de distancia máxima
  const opcionesDistancia = [
    { id: '5', nombre: '5 km' },
    { id: '10', nombre: '10 km' },
    { id: '20', nombre: '20 km' },
    { id: '50', nombre: '50 km' },
    { id: '100', nombre: '100 km' }
  ]

  // Manejar cambio del rango de edad
  const handleEdadRangeChange = (value: [number, number]) => {
    handleInputChange('edad_min', value[0])
    handleInputChange('edad_max', value[1])
  }

  // Obtener el rango de edad actual
  const edadRange: [number, number] = [
    formData.edad_min || 18,
    formData.edad_max || 65
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Qué Busco
      </h3>

      <div className="space-y-8">
        {/* Select de Qué Busco */}
        <div>
          <Select
            id="opciones_que_busco"
            name="opciones_que_busco"
            value={formData.que_busco_id || ''}
            onChange={(value) => handleInputChange('que_busco_id', value)}
            options={opcionesQueBusco}
            label="Qué Busco"
            placeholder="Selecciona qué estás buscando"
            required
          />
          {fieldErrors.que_busco_id && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.que_busco_id}</p>
          )}
        </div>

        {/* Rango de Edad */}
        <div>
          <RangeSlider
            min={18}
            max={80}
            value={edadRange}
            onChange={handleEdadRangeChange}
            label="Rango de Edad que Buscas"
          />
          {(fieldErrors.edad_min || fieldErrors.edad_max) && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.edad_min || fieldErrors.edad_max}
            </p>
          )}
        </div>

        {/* Distancia Máxima */}
        <div>
          <Select
            id="distancia_maxima"
            name="distancia_maxima"
            value={formData.distancia_maxima?.toString() || ''}
            onChange={(value) => handleInputChange('distancia_maxima', parseInt(value))}
            options={opcionesDistancia}
            label="Distancia Máxima"
            placeholder="Selecciona la distancia máxima"
            required
          />
          {fieldErrors.distancia_maxima && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.distancia_maxima}</p>
          )}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-violet-700 bg-violet-100 rounded-md">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando opciones...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-red-700 bg-red-100 rounded-md">
              ❌ {error}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
