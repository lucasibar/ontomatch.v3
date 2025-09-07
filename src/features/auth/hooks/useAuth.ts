import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signIn, signUp, signOut } from '@/store/sliceAuth/authSlice'
import { LoginCredentials, RegisterCredentials } from '@/shared/types/auth'

interface AuthResult {
  success: boolean;
  error?: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, session, loading, error } = useAppSelector((state) => state.auth)

  const handleAuthOperation = async (
    operation: () => Promise<any>
  ): Promise<AuthResult> => {
    try {
      await operation()
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error?.message || 'Error desconocido' 
      }
    }
  }

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    return handleAuthOperation(() => 
      dispatch(signIn(credentials)).unwrap()
    )
  }

  const register = async (credentials: RegisterCredentials): Promise<AuthResult> => {
    return handleAuthOperation(() => 
      dispatch(signUp(credentials)).unwrap()
    )
  }

  const logout = async (): Promise<AuthResult> => {
    return handleAuthOperation(() => 
      dispatch(signOut()).unwrap()
    )
  }

  return {
    // Estado
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Acciones
    login,
    register,
    logout
  }
}
