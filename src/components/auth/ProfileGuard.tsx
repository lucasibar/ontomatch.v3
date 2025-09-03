'use client'

import { useProfileGuard } from '@/features/profile/hooks/useProfileGuard'
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert'

interface ProfileGuardProps {
  children: React.ReactNode
}

export default function ProfileGuard({ children }: ProfileGuardProps) {
  const { isProfileComplete, loading } = useProfileGuard()

  // Mostrar loading mientras se verifica
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando perfil...</p>
        </div>
      </div>
    )
  }

  // Si el perfil no está completo, mostrar la alerta
  if (!isProfileComplete) {
    return <ProfileIncompleteAlert />
  }

  // Si está permitido, mostrar el contenido
  return <>{children}</>
}
