import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { signOut, clearAuth } from '@/store/sliceAuth/authSlice'

export const useLogout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      // Intentar cerrar sesión en Supabase
      await dispatch(signOut()).unwrap()
      
      // Limpiar cualquier estado local adicional
      dispatch(clearAuth())
      
      // Limpiar localStorage manualmente por si acaso
      localStorage.removeItem('ontomatch_session')
      
      // Redirigir al login
      router.push('/login/signin')
      
      // Forzar recarga para limpiar cualquier estado persistente
      router.refresh()
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      
      // Aún así, limpiar todo localmente
      dispatch(clearAuth())
      localStorage.removeItem('ontomatch_session')
      
      // Redirigir al login
      router.push('/login/signin')
      router.refresh()
    }
  }

  return { handleLogout }
}
