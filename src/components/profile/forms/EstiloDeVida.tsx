'use client'

import { useEstiloVida } from '@/features/profile/hooks/useEstiloVida'
import Select from '@/components/ui/Select'
import { useState } from 'react'

export default function EstiloDeVida() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { 
    opcionesHijos,
    opcionesFrecuenciaAlcohol,
    opcionesFrecuenciaFumar,
    opcionesEjercicio,
    opcionesRedesSociales,
    opcionesHabitosSueno,
    opcionesSignosZodiacales,
    opcionesMascotas,
    opcionesHabitosAlimentacion,
    formData, 
    loading, 
    error,
    handleFormUpdate
  } = useEstiloVida()

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del acordeón */}
      <button
        onClick={toggleAccordion}
        className="w-full px-8 py-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
      >
        <h3 className="text-2xl font-semibold text-gray-900">Estilo de Vida</h3>
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
          {/* Hijos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hijos
            </label>
            <Select
              id="hijos"
              name="hijos"
              value={formData.hijos_id}
              onChange={(value) => handleFormUpdate({ hijos_id: value })}
              options={opcionesHijos}
              label=""
              placeholder="Selecciona tu situación con los hijos"
            />
          </div>

          {/* Frecuencia de Alcohol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de Consumo de Alcohol
            </label>
            <Select
              id="frecuencia_alcohol"
              name="frecuencia_alcohol"
              value={formData.frecuencia_alcohol_id}
              onChange={(value) => handleFormUpdate({ frecuencia_alcohol_id: value })}
              options={opcionesFrecuenciaAlcohol}
              label=""
              placeholder="Selecciona tu frecuencia de consumo de alcohol"
            />
          </div>

          {/* Frecuencia de Fumar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de Fumar
            </label>
            <Select
              id="frecuencia_fumar"
              name="frecuencia_fumar"
              value={formData.frecuencia_fumar_id}
              onChange={(value) => handleFormUpdate({ frecuencia_fumar_id: value })}
              options={opcionesFrecuenciaFumar}
              label=""
              placeholder="Selecciona tu frecuencia de fumar"
            />
          </div>

          {/* Ejercicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Ejercicio
            </label>
            <Select
              id="ejercicio"
              name="ejercicio"
              value={formData.ejercicio_id}
              onChange={(value) => handleFormUpdate({ ejercicio_id: value })}
              options={opcionesEjercicio}
              label=""
              placeholder="Selecciona tu nivel de ejercicio"
            />
          </div>

          {/* Redes Sociales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uso de Redes Sociales
            </label>
            <Select
              id="redes_sociales"
              name="redes_sociales"
              value={formData.redes_sociales_id}
              onChange={(value) => handleFormUpdate({ redes_sociales_id: value })}
              options={opcionesRedesSociales}
              label=""
              placeholder="Selecciona tu uso de redes sociales"
            />
          </div>

          {/* Hábitos de Sueño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hábitos de Sueño
            </label>
            <Select
              id="habitos_sueno"
              name="habitos_sueno"
              value={formData.habitos_sueno_id}
              onChange={(value) => handleFormUpdate({ habitos_sueno_id: value })}
              options={opcionesHabitosSueno}
              label=""
              placeholder="Selecciona tus hábitos de sueño"
            />
          </div>

          {/* Signo Zodiacal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signo Zodiacal
            </label>
            <Select
              id="signo_zodiacal"
              name="signo_zodiacal"
              value={formData.signo_zodiacal_id}
              onChange={(value) => handleFormUpdate({ signo_zodiacal_id: value })}
              options={opcionesSignosZodiacales}
              label=""
              placeholder="Selecciona tu signo zodiacal"
            />
          </div>

          {/* Mascotas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mascotas
            </label>
            <Select
              id="mascotas"
              name="mascotas"
              value={formData.mascotas_id}
              onChange={(value) => handleFormUpdate({ mascotas_id: value })}
              options={opcionesMascotas}
              label=""
              placeholder="Selecciona tu situación con mascotas"
            />
          </div>

          {/* Hábitos Alimentarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hábitos Alimentarios
            </label>
            <Select
              id="habitos_alimentacion"
              name="habitos_alimentacion"
              value={formData.habitos_alimentacion_id}
              onChange={(value) => handleFormUpdate({ habitos_alimentacion_id: value })}
              options={opcionesHabitosAlimentacion}
              label=""
              placeholder="Selecciona tus hábitos alimentarios"
            />
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
              Cargando opciones...
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
    </div>
  )
}
