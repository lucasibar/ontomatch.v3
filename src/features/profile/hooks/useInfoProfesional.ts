import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { 
  fetchInfoProfesionalUsuario,
  updateInfoProfesional,
  updateInfoProfesionalFormData,
  clearInfoProfesionalError
} from '@/store/sliceProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const useInfoProfesional = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  
  const {
    formData,
    loading,
    error
  } = useSelector((state: RootState) => state.infoProfesional)
  
  const { profile } = useSelector((state: RootState) => state.profile)

  // Cargar información profesional del usuario cuando esté disponible el profile
  useEffect(() => {
    if (user?.id && profile?.id) {
      dispatch(fetchInfoProfesionalUsuario(profile.id))
    }
  }, [dispatch, user?.id, profile?.id])

  const updateFormData = (field: 'empresa' | 'cargo', value: string) => {
    dispatch(updateInfoProfesionalFormData({ [field]: value }))
  }

  const saveInfoProfesional = async () => {
    if (!profile?.id) return

    try {
      await dispatch(updateInfoProfesional({
        profileId: profile.id,
        empresa: formData.empresa,
        cargo: formData.cargo
      })).unwrap()
    } catch (error) {
      console.error('Error al guardar información profesional:', error)
    }
  }

  const clearError = () => {
    dispatch(clearInfoProfesionalError())
  }

  return {
    formData,
    loading,
    error,
    updateFormData,
    saveInfoProfesional,
    clearError
  }
}
