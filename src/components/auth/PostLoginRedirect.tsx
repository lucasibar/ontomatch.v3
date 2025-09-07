'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfileForm } from '@/features/profile/hooks/useProfileForm'

export default function PostLoginRedirect() {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, loading } = useProfileForm()

  useEffect(() => {
    // Solo verificar cuando no esté cargando y tengamos datos
    if (!loading && user && profile) {
      // Si los datos básicos están cargados, redirigir a swipes
      if (profile.info_basica_cargada) {
        router.push('/swipes')
      }
      // Si no están cargados, quedarse en perfil (no hacer nada)
    }
  }, [user, profile, loading, router])

  // Este componente no renderiza nada, solo maneja la redirección
  return null
}
