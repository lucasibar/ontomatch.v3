'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearError } from '@/store/sliceAuth/authSlice'
import { CheckCircle } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import SignInForm from '@/components/auth/SignInForm'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { user, session } = useAppSelector((state) => state.auth)

  // Limpiar errores al entrar a la página
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user && session) {
      if (user.email_confirmed_at) {
        router.push('/perfil')
      } else {
        router.push('/login/confirm-email')
      }
    }
  }, [user, session, router])

  const footerLinks = [
    {
      text: '¿No tienes cuenta?',
      href: '/login/register',
      linkText: 'Regístrate aquí'
    },
    {
      text: '',
      href: '/login/forgot-password',
      linkText: '¿Olvidaste tu contraseña?'
    }
  ];

  return (
    <AuthLayout
      title="Iniciar Sesión"
      footerLinks={footerLinks}
    >
      {/* Mensaje de éxito cuando se cambió la contraseña */}
      {searchParams.get('message') === 'password-changed' && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center justify-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">¡Contraseña cambiada exitosamente!</span>
        </div>
      )}

      <SignInForm />
    </AuthLayout>
  )
}
