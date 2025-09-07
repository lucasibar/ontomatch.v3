import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { supabase } from '@/lib/supabase'

export function useProfileGuard() {
  const { user, isAuthenticated } = useAuth()
  const { profile, loading } = useProfile()
  const [isVerifying, setIsVerifying] = useState(false)

  // Solo cargar el perfil si el usuario está autenticado
  const shouldLoadProfile = isAuthenticated && !!user
  
  // Retornar si está permitido acceder (perfil completo)
  const isProfileComplete = shouldLoadProfile && !loading && profile?.info_basica_cargada

  // Verificar directamente en la base de datos si hay dudas sobre el estado
  const verifyProfileInDatabase = async () => {
    if (!user?.id || isVerifying) return
    
    setIsVerifying(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('info_basica_cargada')
        .eq('id', user.id)
        .single()
      
      if (!error && data?.info_basica_cargada && !isProfileComplete) {
        // Si la base de datos dice que está completo pero el estado local no, recargar
        window.location.reload()
      }
    } catch (error) {
      console.error('Error verificando perfil en base de datos:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  // Verificar en la base de datos si el perfil parece incompleto pero debería estar completo
  useEffect(() => {
    if (shouldLoadProfile && !loading && !isProfileComplete && user?.id) {
      // Solo verificar si no hemos verificado recientemente
      const lastVerification = localStorage.getItem('lastProfileVerification')
      const now = Date.now()
      
      if (!lastVerification || (now - parseInt(lastVerification)) > 5000) { // 5 segundos
        localStorage.setItem('lastProfileVerification', now.toString())
        verifyProfileInDatabase()
      }
    }
  }, [shouldLoadProfile, loading, isProfileComplete, user?.id])

  return { 
    isProfileComplete, 
    loading: shouldLoadProfile ? loading : false, 
    profile, 
    user 
  }
}
