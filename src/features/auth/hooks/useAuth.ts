import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signIn, signUp, signOut } from '@/store/sliceAuth/authSlice'
import { LoginCredentials, RegisterCredentials } from '@/shared/types/auth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, session, loading, error } = useAppSelector((state) => state.auth)

  const login = async (credentials: LoginCredentials) => {
    try {
      await dispatch(signIn(credentials)).unwrap()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      await dispatch(signUp(credentials)).unwrap()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await dispatch(signOut()).unwrap()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  }
}
