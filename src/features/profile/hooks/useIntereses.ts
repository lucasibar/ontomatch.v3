import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { supabase } from '@/lib/supabase'
import { 
  fetchIntereses,
  fetchCategoriasIntereses,
  fetchInteresesUsuario,
  guardarInteresesUsuario,
  toggleInteres,
  setInteresesSeleccionados,
  clearInteresesError
} from '@/store/sliceProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const useIntereses = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  
  const {
    intereses,
    categorias,
    interesesSeleccionados,
    loading,
    error
  } = useSelector((state: RootState) => state.intereses)
  
  const { profile } = useSelector((state: RootState) => state.profile)

  const [isSaving, setIsSaving] = useState(false)

  // Cargar intereses y categorías al montar el componente
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchIntereses())
      dispatch(fetchCategoriasIntereses())
    }
  }, [dispatch, user?.id])

  // Cargar intereses del usuario cuando esté disponible el profile
  useEffect(() => {
    if (user?.id && profile?.id) {
      // Por ahora, inicializar como vacío hasta resolver el problema de acceso
      console.log('ℹ️ Inicializando intereses como vacío (problema de acceso a BD)')
      dispatch(setInteresesSeleccionados([]))
    }
  }, [dispatch, user?.id, profile?.id])

  const handleToggleInteres = (interesId: string) => {
    dispatch(toggleInteres(interesId))
  }

  const guardarIntereses = async () => {
    if (!profile?.id) return

    setIsSaving(true)
    try {
      await dispatch(guardarInteresesUsuario({
        profileId: profile.id,
        interesesIds: interesesSeleccionados
      })).unwrap()
    } catch (error) {
      console.error('Error al guardar intereses:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const clearError = () => {
    dispatch(clearInteresesError())
  }

  // Función para obtener intereses por categoría
  const getInteresesPorCategoria = (categoriaNombre: string) => {
    return intereses.filter((interes: any) => 
      interes.categoria_nombre === categoriaNombre
    )
  }

  // Función para verificar si un interés está seleccionado
  const isInteresSeleccionado = (interesId: string) => {
    return interesesSeleccionados.includes(interesId)
  }

  return {
    intereses,
    categorias,
    interesesSeleccionados,
    loading,
    error,
    isSaving,
    handleToggleInteres,
    guardarIntereses,
    clearError,
    getInteresesPorCategoria,
    isInteresSeleccionado
  }
}
