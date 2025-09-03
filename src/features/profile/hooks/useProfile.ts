import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  updateProfile,
  clearProfileError,
  fetchProfile
} from '@/store/sliceProfile'
import { 
  fetchGenerosPrimarios, 
  fetchGenerosSecundarios 
} from '@/store/sliceProfile'
import { 
  fetchUbicaciones 
} from '@/store/sliceProfile'
import { 
  updateEstiloVida 
} from '@/store/sliceProfile'
import { 
  guardarInteresesUsuario 
} from '@/store/sliceProfile'
import { ProfileFormData, REQUIRED_FIELDS } from '@/shared/types/profile'

export function useProfile() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  
  // Estados separados por slice
  const { profile, loading, error } = useAppSelector((state) => state.profile)
  const { generosPrimarios } = useAppSelector((state) => state.generos)
  const { generosSecundarios } = useAppSelector((state) => state.generos)
  const { ubicaciones } = useAppSelector((state) => state.ubicacion)
  
  // Estados para Estilo de Vida e Intereses
  const { formData: estiloVidaFormData } = useAppSelector((state) => state.estiloVida)
  const { interesesSeleccionados } = useAppSelector((state) => state.intereses)
  
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre_completo: '',
    descripcion: '',
    edad: 18,
    altura: null,
    genero_primario_id: '',
    genero_secundario_id: '',
    ubicacion_id: '',
    opciones_que_busco_id: '',
    orientacion_sexual_id: '',
    edad_min: 18,
    edad_max: 65,
    distancia_maxima: 20,
    empresa: '',
    cargo: '',
    escuela_coaching_id: ''
  })

  // Estado de errores de validación
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  // Estado para controlar si el formulario ya se intentó enviar
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id))
      dispatch(fetchGenerosPrimarios())
      dispatch(fetchGenerosSecundarios())
      dispatch(fetchUbicaciones())
    }
  }, [user?.id, dispatch])

  // Actualizar formulario cuando se cargue el perfil
  useEffect(() => {
    if (profile) {
      setFormData({
        nombre_completo: profile.nombre_completo || '',
        descripcion: profile.descripcion || '',
        edad: profile.edad || 18,
        altura: profile.altura || null,
        genero_primario_id: profile.genero_primario_id || '',
        genero_secundario_id: profile.genero_secundario_id || '',
        ubicacion_id: profile.ubicacion_id || '',
        opciones_que_busco_id: profile.opciones_que_busco_id || '',
        orientacion_sexual_id: profile.orientacion_sexual_id || '',
        edad_min: profile.edad_min || 18,
        edad_max: profile.edad_max || 65,
        distancia_maxima: profile.distancia_maxima || 20,
        empresa: profile.empresa || '',
        cargo: profile.cargo || '',
        escuela_coaching_id: profile.escuela_coaching_id || ''
      })
    }
  }, [profile])

  // Verificar si debe redirigir a swipes
  useEffect(() => {
    if (profile?.info_basica_cargada) {
      router.push('/swipes')
    }
  }, [profile?.info_basica_cargada, router])

  // Validar campo específico
  const validateField = (field: keyof ProfileFormData, value: any) => {
    if (REQUIRED_FIELDS.includes(field)) {
      if (!value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value === 0)) {
        setFieldErrors(prev => ({ ...prev, [field]: 'Este campo es obligatorio' }))
        return false
      } else {
        setFieldErrors(prev => ({ ...prev, [field]: '' }))
        return true
      }
    }
    return true
  }

  // Verificar si todo el formulario es válido
  const isFormValid = REQUIRED_FIELDS.every(field => {
    const value = formData[field]
    return value && (typeof value === 'string' ? value.trim() !== '' : value !== 0)
  })

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value as any
    }))

    // Solo validar si ya se intentó enviar el formulario
    if (hasAttemptedSubmit) {
      validateField(field, value)
    }

    // Si cambia el género primario, limpiar el secundario
    if (field === 'genero_primario_id') {
      setFormData(prev => ({
        ...prev,
        [field]: value as string,
        genero_secundario_id: ''
      }))
      // Limpiar error del género secundario ya que se resetea
      if (hasAttemptedSubmit) {
        setFieldErrors(prev => ({ ...prev, genero_secundario_id: '' }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile?.id) return

    // Marcar que se intentó enviar el formulario
    setHasAttemptedSubmit(true)

    // Validar todos los campos obligatorios antes de enviar
    const allFieldsValid = REQUIRED_FIELDS.every(field => validateField(field, formData[field]))
    
    if (!allFieldsValid) {
      // Hacer scroll suave hacia el primer campo con error
      const firstErrorField = REQUIRED_FIELDS.find(field => fieldErrors[field])
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
          // Dar focus al campo para mejor UX
          element.focus()
        }
      }
      return // No enviar si hay errores de validación
    }

    try {
      // 1. Guardar perfil principal
      await dispatch(updateProfile({
        id: profile.id,
        ...formData,
        info_basica_cargada: true
      })).unwrap()

      // 2. Guardar estilo de vida
      if (estiloVidaFormData) {
        await dispatch(updateEstiloVida({
          profileId: profile.id,
          ...estiloVidaFormData
        })).unwrap()
      }

      // 3. Guardar intereses
      if (interesesSeleccionados && interesesSeleccionados.length > 0) {
        await dispatch(guardarInteresesUsuario({
          profileId: profile.id,
          interesesIds: interesesSeleccionados
        })).unwrap()
      }
      
      // La redirección se maneja automáticamente en el useEffect
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
    }
  }

  return {
    profile,
    formData,
    loading,
    error,
    generosPrimarios,
    generosSecundarios,
    ubicaciones,
    fieldErrors,
    isFormValid,
    hasAttemptedSubmit,
    handleInputChange,
    handleSubmit,
    clearError: () => dispatch(clearProfileError())
  }
}
