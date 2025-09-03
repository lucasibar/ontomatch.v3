import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchOpcionesOrientacionSexual } from '@/store/sliceProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const useOrientacionSexual = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  
  const {
    opcionesOrientacionSexual,
    loading,
    error
  } = useSelector((state: RootState) => state.orientacionSexual)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOpcionesOrientacionSexual())
    }
  }, [dispatch, user?.id])

  const clearError = () => {
    // Aquí podrías dispatch clearError si lo implementas en el slice
  }

  return {
    opcionesOrientacionSexual,
    loading,
    error,
    clearError
  }
}
