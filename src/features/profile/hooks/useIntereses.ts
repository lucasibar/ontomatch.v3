import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
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
import { useProfile } from './useProfile'
import { supabase } from '@/lib/supabase'

export const useIntereses = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { profile } = useProfile()
  
  const {
    intereses,
    categorias,
    interesesSeleccionados,
    loading,
    error
  } = useSelector((state: RootState) => state.intereses)

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
      cargarInteresesUsuario()
    }
  }, [user?.id, profile?.id])

  const cargarInteresesUsuario = async () => {
    if (!profile?.id) return
    
    try {
      const { data, error } = await supabase
        .from('profile_intereses')
        .select('interes_id')
        .eq('profile_id', profile.id)

      if (error) {
        // Si es un error de permisos, no mostrar error en consola
        if (error.code === '42501') {
          console.log('No hay permisos para acceder a profile_intereses o no hay intereses guardados')
          // Inicializar con array vacío
          dispatch(setInteresesSeleccionados([]))
          return
        }
        
        console.error('Error al cargar intereses del usuario:', error)
        return
      }

      // Si no hay datos, inicializar con array vacío
      const interesesIds = data?.map(item => item.interes_id) || []
      dispatch(setInteresesSeleccionados(interesesIds))
    } catch (error) {
      console.error('Error al cargar intereses del usuario:', error)
      // En caso de error, inicializar con array vacío
      dispatch(setInteresesSeleccionados([]))
    }
  }

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
