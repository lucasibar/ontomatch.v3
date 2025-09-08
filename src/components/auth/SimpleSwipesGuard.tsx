'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfileForm } from '@/features/profile/hooks/useProfileForm'
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert'
import { Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SimpleSwipesGuardProps {
  children: React.ReactNode
}

export default function SimpleSwipesGuard({ children }: SimpleSwipesGuardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useProfileForm()
  const [isLoading, setIsLoading] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)
  const [profileTimeout, setProfileTimeout] = useState(false)

  useEffect(() => {
    if (hasChecked) return

    const checkAuth = async () => {
      try {
        setHasChecked(true)
        
        // Verificar sesión con Supabase
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // No hay sesión, redirigir al login
          router.push('/login/signin')
          return
        }

        // Si hay sesión pero no hay usuario en el store, esperar un poco más
        if (!user) {
          setTimeout(() => setIsLoading(false), 1000)
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        router.push('/login/signin')
      }
    }

    checkAuth()
  }, [router, user, hasChecked])

  // Timeout para evitar carga infinita del perfil
  useEffect(() => {
    if (user && profileLoading) {
      const timeout = setTimeout(() => {
        setProfileTimeout(true)
      }, 5000) // 5 segundos

      return () => clearTimeout(timeout)
    }
  }, [user, profileLoading])

  // Verificar el perfil directamente en la base de datos si el estado local no está actualizado
  useEffect(() => {
    const verifyProfileInDatabase = async () => {
      if (!user?.id || !profile) return
      
      // Si el perfil local dice que está completo, no verificar
      if (profile.info_basica_cargada) return
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('info_basica_cargada')
          .eq('id', user.id)
          .single()
        
        if (!error && data?.info_basica_cargada) {
          // El perfil está completo en la BD pero no en el estado local, recargar
          window.location.reload()
        }
      } catch (error) {
        console.error('Error verificando perfil en SimpleSwipesGuard:', error)
      }
    }

    // Solo ejecutar si tenemos user y profile
    if (user?.id && profile) {
      verifyProfileInDatabase()
    }
  }, [user?.id, profile])

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Verificando acceso...
          </h2>
        </div>
      </div>
    )
  }

  // Si no hay usuario, redirigir
  if (!user) {
    router.push('/login/signin')
    return null
  }

  // Mostrar loading solo si no hay perfil Y está cargando (evitar loop infinito)
  if (!profile && profileLoading && !profileTimeout) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Cargando perfil...
          </h2>
        </div>
      </div>
    )
  }

  // Si hay timeout del perfil, verificar directamente en la BD
  if (profileTimeout && !profile) {
    // Verificar directamente en la BD y redirigir apropiadamente
    const checkProfileInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('info_basica_cargada')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          if (data.info_basica_cargada) {
            // Perfil completo, recargar para actualizar el estado
            window.location.reload()
          } else {
            // Perfil incompleto, ir a completar
            router.push('/perfil')
          }
        } else {
          // Error o no existe perfil, ir a completar
          router.push('/perfil')
        }
      } catch (error) {
        console.error('Error verificando perfil en timeout:', error)
        router.push('/perfil')
      }
    }
    
    checkProfileInDB()
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Verificando perfil...
          </h2>
        </div>
      </div>
    )
  }

  // Si hay perfil pero está en loading, verificar directamente
  if (profile && profileLoading) {
    // Si el perfil existe pero loading es true, verificar el estado directamente
    if (profile.info_basica_cargada) {
      // Perfil completo, mostrar swipes
      return <>{children}</>
    } else {
      // Perfil incompleto, mostrar alerta
      return <ProfileIncompleteAlert />
    }
  }

  // Si el perfil no está completo, mostrar la alerta
  if (profile && !profile.info_basica_cargada) {
    return <ProfileIncompleteAlert />
  }

  // Si todo está bien, mostrar swipes
  return <>{children}</>
}
