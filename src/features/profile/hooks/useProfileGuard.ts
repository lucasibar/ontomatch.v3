import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'

export function useProfileGuard() {
  const { user } = useAuth()
  const { profile, loading } = useProfile()

  // Retornar si está permitido acceder (perfil completo)
  const isProfileComplete = !loading && user && profile?.info_basica_cargada

  return { isProfileComplete, loading, profile, user }
}
