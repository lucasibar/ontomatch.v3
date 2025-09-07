import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { 
  fetchOpcionesHijos,
  fetchOpcionesFrecuenciaAlcohol,
  fetchOpcionesFrecuenciaFumar,
  fetchOpcionesEjercicio,
  fetchOpcionesRedesSociales,
  fetchOpcionesHabitosSueno,
  fetchOpcionesSignosZodiacales,
  fetchOpcionesMascotas,
  fetchOpcionesHabitosAlimentacion,
  fetchEstiloVidaUsuario,
  clearEstiloVidaError,
  updateFormData,
  resetFormData,
  clearEstiloVida
} from '@/store/sliceProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const useEstiloVida = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  
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
    error
  } = useSelector((state: RootState) => state.estiloVida)

  const { profile } = useSelector((state: RootState) => state.profile)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOpcionesHijos())
      dispatch(fetchOpcionesFrecuenciaAlcohol())
      dispatch(fetchOpcionesFrecuenciaFumar())
      dispatch(fetchOpcionesEjercicio())
      dispatch(fetchOpcionesRedesSociales())
      dispatch(fetchOpcionesHabitosSueno())
      dispatch(fetchOpcionesSignosZodiacales())
      dispatch(fetchOpcionesMascotas())
      dispatch(fetchOpcionesHabitosAlimentacion())
    }
  }, [dispatch, user?.id])

  // Cargar estilo de vida del usuario cuando esté disponible el profile
  useEffect(() => {
    if (user?.id && profile?.id) {
      dispatch(fetchEstiloVidaUsuario(profile.id))
    }
  }, [dispatch, user?.id, profile?.id])

  // Limpiar al desmontar - COMENTADO TEMPORALMENTE
  // useEffect(() => {
  //   return () => {
  //     dispatch(clearEstiloVida())
  //   }
  // }, [dispatch])

  const handleFormUpdate = (updates: any) => {
    dispatch(updateFormData(updates))
  }

  const clearError = () => {
    dispatch(clearEstiloVidaError())
  }

  const handleReset = () => {
    dispatch(resetFormData())
  }

  return {
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
    handleFormUpdate,
    clearError,
    handleReset
  }
}
