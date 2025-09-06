'use client'

import { ProfileFormData, GeneroPrimario, Ubicacion } from '@/shared/types/profile'
import { useMemo, useState } from 'react'
import { useOrientacionSexual } from '@/features/profile/hooks/useOrientacionSexual'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'

interface InformacionBasicaProps {
  formData: ProfileFormData
  handleInputChange: (field: keyof ProfileFormData, value: string | number | null) => void
  generosPrimarios: GeneroPrimario[]
  ubicaciones: Ubicacion[]
  fieldErrors: Record<string, string>
  hasAttemptedSubmit: boolean
}

export default function InformacionBasica({
  formData,
  handleInputChange,
  generosPrimarios,
  ubicaciones,
  fieldErrors,
  hasAttemptedSubmit
}: InformacionBasicaProps) {
  const { opcionesOrientacionSexual, loading: loadingOrientacion, error: errorOrientacion } = useOrientacionSexual()

  // Estados para los selects de ubicación
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('')

  // Obtener provincias únicas
  const provincias = useMemo(() => {
    const provinciasUnicas = Array.from(new Set(ubicaciones.map(u => u.provincia)))
    return provinciasUnicas.map(provincia => ({
      id: provincia,
      nombre: provincia
    }))
  }, [ubicaciones])

  // Obtener ciudades según provincia seleccionada
  const ciudades = useMemo(() => {
    if (!provinciaSeleccionada) return []
    const ciudadesUnicas = Array.from(new Set(
      ubicaciones
        .filter(u => u.provincia === provinciaSeleccionada)
        .map(u => u.ciudad)
    ))
    return ciudadesUnicas.map(ciudad => ({
      id: ciudad,
      nombre: ciudad
    }))
  }, [ubicaciones, provinciaSeleccionada])

  // Obtener localidades según ciudad seleccionada
  const localidades = useMemo(() => {
    if (!provinciaSeleccionada || !ciudadSeleccionada) return []
    const localidadesUnicas = Array.from(new Set(
      ubicaciones
        .filter(u => u.provincia === provinciaSeleccionada && u.ciudad === ciudadSeleccionada)
        .map(u => u.localidad)
        .filter(Boolean) // Filtrar nulls
    ))
    return localidadesUnicas.map(localidad => ({
      id: localidad!,
      nombre: localidad!
    }))
  }, [ubicaciones, provinciaSeleccionada, ciudadSeleccionada])

  // Manejar cambio de provincia
  const handleProvinciaChange = (provincia: string) => {
    setProvinciaSeleccionada(provincia)
    setCiudadSeleccionada('')
    // Limpiar ubicación seleccionada
    handleInputChange('ubicacion_id', '')
  }

  // Manejar cambio de ciudad
  const handleCiudadChange = (ciudad: string) => {
    setCiudadSeleccionada(ciudad)
    // Limpiar ubicación seleccionada
    handleInputChange('ubicacion_id', '')
  }

  // Manejar cambio de localidad y encontrar la ubicación correspondiente
  const handleLocalidadChange = (localidad: string) => {
    const ubicacion = ubicaciones.find(u => 
      u.provincia === provinciaSeleccionada && 
      u.ciudad === ciudadSeleccionada && 
      u.localidad === localidad
    )
    
    if (ubicacion) {
      handleInputChange('ubicacion_id', ubicacion.id)
    }
  }

  // Inicializar provincia y ciudad cuando se carga el perfil
  useMemo(() => {
    if (formData.ubicacion_id && ubicaciones.length > 0) {
      const ubicacionSeleccionada = ubicaciones.find(u => u.id === formData.ubicacion_id)
      if (ubicacionSeleccionada) {
        setProvinciaSeleccionada(ubicacionSeleccionada.provincia)
        setCiudadSeleccionada(ubicacionSeleccionada.ciudad)
      }
    }
  }, [formData.ubicacion_id, ubicaciones])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Información Básica
      </h3>

      <div className="space-y-6">
        {/* Nombre Completo */}
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre_completo"
            name="nombre_completo"
            type="text"
            value={formData.nombre_completo}
            onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              fieldErrors.nombre_completo 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-violet-500'
            }`}
            placeholder="Tu nombre completo"
            required
          />
          {hasAttemptedSubmit && fieldErrors.nombre_completo && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.nombre_completo}</p>
          )}
        </div>

        {/* Edad y Altura en la misma línea */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-2">
              Edad <span className="text-red-500">*</span>
            </label>
            <input
              id="edad"
              name="edad"
              type="number"
              min="18"
              max="100"
              value={formData.edad}
              onChange={(e) => handleInputChange('edad', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                fieldErrors.edad 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-violet-500'
              }`}
              placeholder="Tu edad"
              required
            />
            {hasAttemptedSubmit && fieldErrors.edad && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.edad}</p>
            )}
          </div>

        </div>

        {/* Género Primario */}
        <div>
          <Select
            id="genero_primario"
            name="genero_primario"
            value={formData.genero_primario_id}
            onChange={(value) => handleInputChange('genero_primario_id', value)}
            options={generosPrimarios}
            label="Tu Género Primario"
            required
            placeholder="Selecciona tu género primario"
          />
          {hasAttemptedSubmit && fieldErrors.genero_primario_id && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.genero_primario_id}</p>
          )}
        </div>

        {/* Orientación Sexual */}
        <div>
          <Select
            id="orientacion_sexual"
            name="orientacion_sexual"
            value={formData.orientacion_sexual_id || ''}
            onChange={(value) => handleInputChange('orientacion_sexual_id', value)}
            options={opcionesOrientacionSexual}
            label="Tu Orientación Sexual"
            placeholder="Selecciona tu orientación sexual"
          />

          {/* Estado de carga para orientación sexual */}
          {loadingOrientacion && (
            <div className="mt-2 text-sm text-violet-600">
              Cargando opciones...
            </div>
          )}

          {/* Error para orientación sexual */}
          {errorOrientacion && (
            <div className="mt-2 text-sm text-red-600">
              ❌ {errorOrientacion}
            </div>
          )}
        </div>

        {/* Ubicación - 3 selects en cascada */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Provincia */}
            <div>
              <Select
                id="provincia"
                name="provincia"
                value={provinciaSeleccionada}
                onChange={handleProvinciaChange}
                options={provincias}
                label="Provincia"
                required
                placeholder="Selecciona provincia"
              />
            </div>

            {/* Ciudad */}
            <div>
              <Select
                id="ciudad"
                name="ciudad"
                value={ciudadSeleccionada}
                onChange={handleCiudadChange}
                options={ciudades}
                label="Ciudad"
                required
                placeholder="Selecciona ciudad"
                disabled={!provinciaSeleccionada}
              />
            </div>

            {/* Localidad */}
            <div>
              <Select
                id="localidad"
                name="localidad"
                value={formData.ubicacion_id ? 
                  ubicaciones.find(u => u.id === formData.ubicacion_id)?.localidad || '' : ''}
                onChange={handleLocalidadChange}
                options={localidades}
                label="Localidad"
                placeholder="Selecciona localidad"
                disabled={!ciudadSeleccionada}
              />
            </div>
          </div>

          {/* Error de ubicación */}
          {hasAttemptedSubmit && fieldErrors.ubicacion_id && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.ubicacion_id}</p>
          )}
        </div>
      </div>
    </div>
  )
}
