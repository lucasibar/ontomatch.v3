'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearError } from '@/store/sliceAuth/authSlice'
import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const router = useRouter()
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
      text: '¿Ya tienes cuenta?',
      href: '/login/signin',
      linkText: 'Inicia sesión aquí'
    }
  ];

  return (
    <AuthLayout
      title="Crear Cuenta"
      footerLinks={footerLinks}
    >
      <RegisterForm />
    </AuthLayout>
  )
}
