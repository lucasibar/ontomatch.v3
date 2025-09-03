import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchOpcionesQueBusco } from '@/store/sliceProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const useQueBusco = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  
  const {
    opcionesQueBusco,
    loading,
    error
  } = useSelector((state: RootState) => state.queBusco)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOpcionesQueBusco())
    }
  }, [dispatch, user?.id])

  const clearError = () => {
    // Aquí podrías dispatch clearError si lo implementas en el slice
  }

  return {
    opcionesQueBusco,
    loading,
    error,
    clearError
  }
}
