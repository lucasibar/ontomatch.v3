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
import { ProfileFormData } from '@/shared/types/profile'

export function useProfile() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  
  // Estados separados por slice
  const { profile, loading, error } = useAppSelector((state) => state.profile)
  const { generosPrimarios } = useAppSelector((state) => state.generos)
  const { generosSecundarios } = useAppSelector((state) => state.generos)
  const { ubicaciones } = useAppSelector((state) => state.ubicacion)
  
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

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value as any
    }))

    // Si cambia el género primario, limpiar el secundario
    if (field === 'genero_primario_id') {
      setFormData(prev => ({
        ...prev,
        [field]: value as string,
        genero_secundario_id: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile?.id) return

    try {
      await dispatch(updateProfile({
        id: profile.id,
        ...formData,
        info_basica_cargada: true
      })).unwrap()
      
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
    handleInputChange,
    handleSubmit,
    clearError: () => dispatch(clearProfileError())
  }
}
