'use client'

import { useMemo, useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfileLocal } from '@/store/sliceProfile'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import GenderSecondaryModal from './GenderSecondaryModal'

interface InformacionBasicaProps {
  validationErrors?: Record<string, string>
}

export default function InformacionBasica({ validationErrors = {} }: InformacionBasicaProps) {
  const dispatch = useAppDispatch()
  
  // Estados de Redux
  const { profile } = useAppSelector((state) => state.profile)
  const { generosPrimarios } = useAppSelector((state) => state.generos)
  const { generosSecundarios } = useAppSelector((state) => state.generos)
  const { ubicaciones } = useAppSelector((state) => state.ubicacion)
  const { opcionesOrientacionSexual, error: errorOrientacion } = useAppSelector((state) => state.orientacionSexual)

  // Estado local del formulario - inicializado con datos de profile
  const [formData, setFormData] = useState({
    nombre_completo: profile?.nombre_completo || '',
    descripcion: profile?.descripcion || '',
    edad: profile?.edad || 0,
    altura: profile?.altura || 0,
    genero_primario_id: profile?.genero_primario_id || '',
    genero_secundario_id: profile?.genero_secundario_id || '',
    orientacion_sexual_id: profile?.orientacion_sexual_id || '',
    ubicacion_id: profile?.ubicacion_id || ''
  })
  
  // Estados para los selects de ubicación
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('')
  const [isGenderSecondaryModalOpen, setIsGenderSecondaryModalOpen] = useState(false)
  
  // Estado local para errores de validación (si los usás)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Actualizar estado local cuando cambie profile
  useEffect(() => {
    if (profile) {
      setFormData({
        nombre_completo: profile.nombre_completo || '',
        descripcion: profile.descripcion || '',
        edad: profile.edad || 0,
        altura: profile.altura || 0,
        genero_primario_id: profile.genero_primario_id || '',
        genero_secundario_id: profile.genero_secundario_id || '',
        orientacion_sexual_id: profile.orientacion_sexual_id || '',
        ubicacion_id: profile.ubicacion_id || ''
      })
    }
  }, [profile])

  // Función para manejar cambios en campos básicos
  const handleInputChange = (field: string, value: string | number | null) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData) // Actualizar estado local
    dispatch(updateProfileLocal({ [field]: value })) // Actualizar Redux
  }

  // Función para manejar cambio de género primario
  const handleGeneroPrimarioChange = (generoId: string) => {
    const newFormData = { 
      ...formData, 
      genero_primario_id: generoId,
      genero_secundario_id: '' // Limpiar género secundario
    }
    setFormData(newFormData)
    dispatch(updateProfileLocal({ 
      genero_primario_id: generoId,
      genero_secundario_id: '' 
    }))
  }

  // Función para manejar cambio de género secundario
  const handleGeneroSecundarioChange = (generoId: string) => {
    const newFormData = { ...formData, genero_secundario_id: generoId }
    setFormData(newFormData)
    dispatch(updateProfileLocal({ genero_secundario_id: generoId }))
  }

  // Función para manejar cambio de orientación sexual
  const handleOrientacionSexualChange = (orientacionId: string) => {
    const newFormData = { ...formData, orientacion_sexual_id: orientacionId }
    setFormData(newFormData)
    dispatch(updateProfileLocal({ orientacion_sexual_id: orientacionId }))
  }

  // Provincias únicas
  const provincias = useMemo(() => {
    const provinciasUnicas = Array.from(new Set(ubicaciones.map(u => u.provincia)))
    return provinciasUnicas.map(provincia => ({
      id: provincia,
      nombre: provincia
    }))
  }, [ubicaciones])

  // Ciudades por provincia
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

  // Localidades por ciudad
  const localidades = useMemo(() => {
    if (!provinciaSeleccionada || !ciudadSeleccionada) return []
    const localidadesUnicas = Array.from(new Set(
      ubicaciones
        .filter(u => u.provincia === provinciaSeleccionada && u.ciudad === ciudadSeleccionada)
        .map(u => u.localidad)
        .filter(Boolean)
    ))
    return localidadesUnicas.map(localidad => ({
      id: localidad as string,
      nombre: localidad as string
    }))
  }, [ubicaciones, provinciaSeleccionada, ciudadSeleccionada])

  // Cambio de provincia
  const handleProvinciaChange = (provincia: string) => {
    setProvinciaSeleccionada(provincia)
    setCiudadSeleccionada('')
    const newFormData = { ...formData, ubicacion_id: '' }
    setFormData(newFormData)
    dispatch(updateProfileLocal({ ubicacion_id: '' }))
  }

  // Cambio de ciudad
  const handleCiudadChange = (ciudad: string) => {
    setCiudadSeleccionada(ciudad)
    const newFormData = { ...formData, ubicacion_id: '' }
    setFormData(newFormData)
    dispatch(updateProfileLocal({ ubicacion_id: '' }))
  }

  // Cambio de localidad => setear ubicacion_id
  const handleLocalidadChange = (localidad: string) => {
    const ubicacion = ubicaciones.find(u => 
      u.provincia === provinciaSeleccionada && 
      u.ciudad === ciudadSeleccionada && 
      u.localidad === localidad
    )
    
    if (ubicacion) {
      const newFormData = { ...formData, ubicacion_id: ubicacion.id }
      setFormData(newFormData)
      dispatch(updateProfileLocal({ ubicacion_id: ubicacion.id }))
    }
  }

  // Filtrar géneros secundarios según primario
  const generosSecundariosFiltrados = useMemo(() => {
    if (!formData.genero_primario_id) return []
    return generosSecundarios.filter(g => g.genero_primario_id === formData.genero_primario_id)
  }, [generosSecundarios, formData.genero_primario_id])

  // Inicializar provincia/ciudad desde profile.ubicacion_id
  useEffect(() => {
    if (profile.ubicacion_id && ubicaciones.length > 0) {
      const ubicacionSeleccionada = ubicaciones.find(u => u.id === profile.ubicacion_id)
      if (ubicacionSeleccionada) {
        setProvinciaSeleccionada(ubicacionSeleccionada.provincia)
        setCiudadSeleccionada(ubicacionSeleccionada.ciudad)
      }
    }
  }, [profile.ubicacion_id, ubicaciones])

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
            value={formData.nombre_completo || ''}
            onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              fieldErrors.nombre_completo 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-violet-500'
            }`}
            placeholder="Tu nombre completo"
            required
          />
          {validationErrors.nombre_completo && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.nombre_completo}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 border-gray-300 focus:border-violet-500 resize-y"
            placeholder="Contá algo sobre vos (opcional)"
          />
        </div>

        {/* Edad y Altura */}
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
              value={formData.edad || ''}
              onChange={(e) => handleInputChange('edad', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                fieldErrors.edad 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-violet-500'
              }`}
              placeholder="Tu edad"
              required
            />
            {validationErrors.edad && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.edad}</p>
            )}
          </div>

          <div>
            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-2">
              Altura (cm) <span className="text-red-500">*</span>
            </label>
            <input
              id="altura"
              name="altura"
              type="number"
              min="120"
              max="220"
              value={formData.altura || ''}
              onChange={(e) => handleInputChange('altura', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                fieldErrors.altura 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-violet-500'
              }`}
              placeholder="Tu altura en cm"
              required
            />
            {validationErrors.altura && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.altura}</p>
            )}
          </div>
        </div>

        {/* Género */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              id="genero_primario"
              name="genero_primario"
              value={formData.genero_primario_id || ''}
              onChange={handleGeneroPrimarioChange}
              options={generosPrimarios}
              label="Tu Género"
              required
              placeholder="Selecciona tu género"
            />
            {validationErrors.genero_primario_id && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.genero_primario_id}</p>
            )}
          </div>
          
          {/* Botón + para agregar género secundario */}
          {profile.genero_primario_id && (
            <button
              type="button"
              onClick={() => setIsGenderSecondaryModalOpen(true)}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 rounded-full flex items-center justify-center transition-colors duration-200 mb-1"
              title="Agregar género secundario"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}
        </div>

        {/* Orientación Sexual */}
        <div>
          <Select
            id="orientacion_sexual"
            name="orientacion_sexual"
            value={formData.orientacion_sexual_id || ''}
            onChange={handleOrientacionSexualChange}
            options={opcionesOrientacionSexual}
            label="Tu Orientación Sexual"
            placeholder="Selecciona tu orientación sexual"
          />
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
                  (ubicaciones.find(u => u.id === formData.ubicacion_id)?.localidad || '') : ''}
                onChange={handleLocalidadChange}
                options={localidades}
                label="Localidad"
                placeholder="Selecciona localidad"
                disabled={!ciudadSeleccionada}
              />
            </div>
          </div>

          {validationErrors.ubicacion_id && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.ubicacion_id}</p>
          )}
        </div>
      </div>

      {/* Modal de género secundario */}
      <GenderSecondaryModal
        isOpen={isGenderSecondaryModalOpen}
        onClose={() => setIsGenderSecondaryModalOpen(false)}
        onSelect={handleGeneroSecundarioChange}
        generoPrimarioId={profile.genero_primario_id || ''}
        generoSecundarioActual={profile.genero_secundario_id || ''}
      />
    </div>
  )
}
