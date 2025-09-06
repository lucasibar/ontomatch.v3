import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'

export function useProfileGuard() {
  const { user, isAuthenticated } = useAuth()
  const { profile, loading } = useProfile()

  // Solo cargar el perfil si el usuario está autenticado
  const shouldLoadProfile = isAuthenticated && !!user
  
  // Retornar si está permitido acceder (perfil completo)
  const isProfileComplete = shouldLoadProfile && !loading && profile?.info_basica_cargada

  return { 
    isProfileComplete, 
    loading: shouldLoadProfile ? loading : false, 
    profile, 
    user 
  }
}
