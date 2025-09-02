'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { getSession, clearError, clearAuth } from '@/store/sliceAuth/authSlice'
import { supabase } from '@/lib/supabase'

export function useAuthGuard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Limpiar errores previos al verificar autenticación
        dispatch(clearError())
        
        // Verificar si hay sesión activa en Supabase
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (!currentSession) {
          // No hay sesión, limpiar estado local y redirigir al login
          dispatch(clearAuth())
          router.push('/login/signin')
          return
        }

        // Verificar si el usuario está confirmado
        if (!currentSession.user.email_confirmed_at) {
          // Email no confirmado, redirigir a confirmación
          router.push('/login/confirm-email')
          return
        }

        // Usuario autenticado y email confirmado
        // Actualizar el estado en Redux
        await dispatch(getSession()).unwrap()
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        // En caso de error, limpiar todo y redirigir
        dispatch(clearAuth())
        router.push('/login/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, dispatch])

  return { isLoading, isAuthenticated }
}
