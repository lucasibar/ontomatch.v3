'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert'
import { Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SimpleSwipesGuardProps {
  children: React.ReactNode
}

export default function SimpleSwipesGuard({ children }: SimpleSwipesGuardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [isLoading, setIsLoading] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

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

  // Mostrar loading mientras se carga el perfil
  if (profileLoading) {
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

  // Si el perfil no está completo, mostrar la alerta
  if (profile && !profile.info_basica_cargada) {
    return <ProfileIncompleteAlert />
  }

  // Si todo está bien, mostrar swipes
  return <>{children}</>
}
