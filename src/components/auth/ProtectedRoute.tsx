'use client'

import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard'
import { Heart } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuthGuard()

  if (isLoading) {
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

  if (!isAuthenticated) {
    return null // El hook ya redirige automáticamente
  }

  return <>{children}</>
}
