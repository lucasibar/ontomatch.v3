import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { 
  fetchEscuelasCoaching, 
  crearEscuelaCoaching,
  setEscuelaSeleccionada,
  clearEscuelasCoaching
} from '@/store/sliceProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const useEscuelasCoaching = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  
  const {
    escuelas,
    escuelaSeleccionada,
    loading,
    error
  } = useSelector((state: RootState) => state.escuelasCoaching)

  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchEscuelasCoaching())
    }
  }, [dispatch, user?.id])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      dispatch(clearEscuelasCoaching())
    }
  }, [dispatch])

  // Filtrar escuelas según el término de búsqueda
  const escuelasFiltradas = escuelas.filter(escuela =>
    escuela.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Manejar selección de escuela
  const handleEscuelaSelect = (escuela: any) => {
    dispatch(setEscuelaSeleccionada(escuela))
    setSearchTerm(escuela.nombre)
    setIsCreating(false)
  }

  // Manejar creación de nueva escuela
  const handleCrearEscuela = async () => {
    if (!searchTerm.trim()) return

    setIsCreating(true)
    try {
      await dispatch(crearEscuelaCoaching(searchTerm.trim())).unwrap()
      setSearchTerm('')
    } catch (error) {
      console.error('Error al crear escuela:', error)
    } finally {
      setIsCreating(false)
    }
  }

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsCreating(false)
    
    // Si se borra todo, limpiar selección
    if (!value.trim()) {
      dispatch(setEscuelaSeleccionada(null))
    }
  }

  const clearError = () => {
    // Aquí podrías dispatch clearError si lo implementas en el slice
  }

  return {
    escuelas,
    escuelasFiltradas,
    escuelaSeleccionada,
    searchTerm,
    loading,
    error,
    isCreating,
    handleEscuelaSelect,
    handleCrearEscuela,
    handleSearchChange,
    clearError
  }
}
