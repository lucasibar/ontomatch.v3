import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { store } from '@/store/store'
import { supabase } from '@/lib/supabase'
import { 
  updateProfile,
  clearProfileError,
  fetchProfile,
  fetchGenerosPrimarios, 
  fetchGenerosSecundarios ,
  fetchUbicaciones ,
  updateEstiloVida,
  guardarInteresesUsuario
} from '@/store/sliceProfile'

import { ProfileFormData, REQUIRED_FIELDS } from '@/shared/types/profile'

export function useProfile() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  // Estados separados por slice
  const { profile, loading, error } = useAppSelector((state) => state.profile)
  const { generosPrimarios } = useAppSelector((state) => state.generos)
  const { generosSecundarios } = useAppSelector((state) => state.generos)
  const { ubicaciones } = useAppSelector((state) => state.ubicacion)
  
  // Estados para Estilo de Vida e Intereses
  const { interesesSeleccionados } = useAppSelector((state) => state.intereses)
  
  // Estado de errores de validación
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  // Estado para controlar si ya se cargaron los datos iniciales
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  

  // Cargar datos iniciales (solo una vez)
  useEffect(() => {
    if (user?.id && !initialDataLoaded) {
      dispatch(fetchProfile(user.id))
      dispatch(fetchGenerosPrimarios())
      dispatch(fetchGenerosSecundarios())
      dispatch(fetchUbicaciones())
      setInitialDataLoaded(true)
    }
  }, [user?.id, dispatch, initialDataLoaded])


  // La redirección se maneja en PostLoginRedirect, no aquí
  // para evitar conflictos de doble redirección

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


  const handleInputChange = (field: keyof ProfileFormData, value: string | number | null) => {
    if (!profile) return

    // Validar el campo
    validateField(field, value)

    // Si cambia el género primario, limpiar el secundario
    if (field === 'genero_primario_id') {
      // Limpiar error del género secundario ya que se resetea
      setFieldErrors(prev => ({ ...prev, genero_secundario_id: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile?.id) return
    
    try {
      // Guardar perfil con info_basica_cargada: true
      await dispatch(updateProfile({
        ...profile,
        info_basica_cargada: true
      } as any)).unwrap()

      // Guardar estilo de vida si hay datos (opcional)
      const estiloVidaState = store.getState().estiloVida
      if (estiloVidaState.formData && Object.keys(estiloVidaState.formData).length > 0) {
        console.log('💾 Guardando estilo de vida...', estiloVidaState.formData)
        await dispatch(updateEstiloVida({
          ...estiloVidaState.formData,
          profileId: profile.id
        })).unwrap()
      }

      // Guardar intereses si hay datos (opcional)
      const interesesState = store.getState().intereses
      console.log('🔍 Estado de intereses:', interesesState)
      console.log('🔍 Intereses seleccionados:', interesesState.interesesSeleccionados)
      console.log('🔍 Longitud:', interesesState.interesesSeleccionados?.length)
      
      if (interesesState.interesesSeleccionados && interesesState.interesesSeleccionados.length > 0) {
        console.log('💾 Guardando intereses...', interesesState.interesesSeleccionados)
        try {
          await dispatch(guardarInteresesUsuario({
            profileId: profile.id,
            interesesIds: interesesState.interesesSeleccionados
          })).unwrap()
          console.log('✅ Intereses guardados exitosamente')
        } catch (error) {
          console.error('❌ Error al guardar intereses:', error)
        }
      } else {
        console.log('ℹ️ No hay intereses seleccionados para guardar')
      }

      // Redirigir directamente
      window.location.href = '/swipes'
      
    } catch (error) {
      console.error('Error al guardar perfil:', error)
    } 
  }

  // Función para manejar intereses (sin dependencia circular)
  const handleToggleInteres = (interesId: string) => {
    // Esta función se manejará en el componente Intereses directamente
    // No necesitamos implementarla aquí para evitar dependencias circulares
  }



  return {
    profile,
    loading,
    error,
    generosPrimarios,
    generosSecundarios,
    ubicaciones,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    clearError: () => dispatch(clearProfileError()),
    // Funciones para Estilo de Vida e Intereses
    interesesSeleccionados,
    handleToggleInteres
  }
}
