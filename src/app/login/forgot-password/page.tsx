'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetPassword, clearError } from '@/store/sliceAuth/authSlice'
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  // Limpiar errores al entrar a la página
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      return
    }

    try {
      await dispatch(resetPassword({ email })).unwrap()
      setIsSent(true)
    } catch (error) {
      // El error se maneja en el slice
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Email Enviado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hemos enviado un enlace de recuperación a tu email
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-700">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <p className="text-sm text-gray-500">
                El enlace expira en 1 hora por seguridad.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/login/signin" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
                suppressHydrationWarning={true}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning={true}
            >
              {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/login/signin" 
              className="inline-flex items-center text-sm text-violet-600 hover:text-violet-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
