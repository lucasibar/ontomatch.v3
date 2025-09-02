'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resendConfirmation, clearError } from '@/store/sliceAuth/authSlice'
import { Heart, Mail, CheckCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('')
  
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  // Limpiar errores al entrar a la página
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleResendEmail = async () => {
    if (!email) {
      return
    }

    try {
      await dispatch(resendConfirmation({ email })).unwrap()
    } catch (error) {
      // El error se maneja en el slice
    }
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Confirma tu Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hemos enviado un enlace de confirmación a tu email
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">
              Revisa tu bandeja de entrada y spam
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                ¿No recibiste el email? Ingresa tu dirección:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                suppressHydrationWarning={true}
              />
            </div>

            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning={true}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reenviar Email
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            ¿Ya confirmaste tu email?{' '}
            <Link href="/login/signin" className="text-violet-600 hover:text-violet-500 font-medium">
              Inicia sesión aquí
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            El enlace de confirmación expira en 24 horas
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/login/signin" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  )
}
