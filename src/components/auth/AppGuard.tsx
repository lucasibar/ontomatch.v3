'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { supabase } from '@/lib/supabase'

interface AppGuardProps {
  children: React.ReactNode
}

export default function AppGuard({ children }: AppGuardProps) {
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.profile)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login/signin')
          return
        }

        // Verificar si el perfil está completo
        if (!profile || !profile.info_basica_cargada) {
          router.push('/perfil')
          return
        }

        // Verificar si tiene al menos 3 fotos
        // Esto lo vamos a implementar cuando tengamos el slice de fotos cargado
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login/signin')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, profile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-violet-600 rounded-full flex items-center justify-center animate-spin mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verificando acceso...
          </h2>
          <p className="text-gray-600">
            Preparando tu experiencia
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

