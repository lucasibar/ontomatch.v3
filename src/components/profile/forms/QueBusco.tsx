'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfileLocal } from '@/store/sliceProfile'
import Select from '@/components/ui/Select'
import RangeSlider from '@/components/ui/RangeSlider'

export default function QueBusco() {
  const dispatch = useAppDispatch()
  
  // Estados de Redux
  const { profile } = useAppSelector((state) => state.profile)
  const { opcionesQueBusco, error } = useAppSelector((state) => state.queBusco)
  
  // Estado local para errores
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Opciones de distancia máxima
  const opcionesDistancia = [
    { id: '5', nombre: '5 km' },
    { id: '10', nombre: '10 km' },
    { id: '20', nombre: '20 km' },
    { id: '50', nombre: '50 km' },
    { id: '100', nombre: '100 km' }
  ]

  // Función para manejar cambios
  const handleInputChange = (field: string, value: string | number | null) => {
    dispatch(updateProfileLocal({ [field]: value }))
  }

  // Manejar cambio del rango de edad
  const handleEdadRangeChange = (value: [number, number]) => {
    handleInputChange('edad_min', value[0])
    handleInputChange('edad_max', value[1])
  }

  // Obtener el rango de edad actual
  const edadRange: [number, number] = [
    profile.edad_min || 18,
    profile.edad_max || 65
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
            value={profile.que_busco_id || ''}
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
            value={profile.distancia_maxima?.toString() || ''}
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
