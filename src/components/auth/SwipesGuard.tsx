'use client'

import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard'
import { useProfileGuard } from '@/features/profile/hooks/useProfileGuard'
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert'
import { Heart } from 'lucide-react'

interface SwipesGuardProps {
  children: React.ReactNode
}

export default function SwipesGuard({ children }: SwipesGuardProps) {
  const { isLoading: authLoading, isAuthenticated } = useAuthGuard()
  const { isProfileComplete, loading: profileLoading, user } = useProfileGuard()

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Verificando autenticación...
          </h2>
        </div>
      </div>
    )
  }

  // Si no está autenticado, el useAuthGuard ya redirige automáticamente a login
  if (!isAuthenticated) {
    return null
  }

  // Si está autenticado pero aún no hay usuario en el store, mostrar loading
  if (!user) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Cargando datos del usuario...
          </h2>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras se carga el perfil (solo si el usuario está autenticado)
  if (profileLoading) {
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

  // Si está autenticado pero el perfil no está completo, mostrar la alerta
  if (!isProfileComplete) {
    return <ProfileIncompleteAlert />
  }

  // Si está autenticado y el perfil está completo, mostrar swipes
  return <>{children}</>
}
