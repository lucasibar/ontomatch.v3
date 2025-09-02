'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signIn, clearError } from '@/store/sliceAuth/authSlice'
import { Heart, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { loading, error, user, session } = useAppSelector((state) => state.auth)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await dispatch(signIn({ email, password })).unwrap()
      
      // Verificar si el email está confirmado
      if (result.user?.email_confirmed_at) {
        router.push('/perfil')
      } else {
        router.push('/login/confirm-email')
      }
    } catch (error) {
      // El error se maneja en el slice
    }
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          
          {/* Mensaje de éxito cuando se cambió la contraseña */}
          {searchParams.get('message') === 'password-changed' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">¡Contraseña cambiada exitosamente!</span>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/login/register" className="text-sm text-violet-600 hover:text-violet-500">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                  <Mail className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  suppressHydrationWarning={true}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    suppressHydrationWarning={true}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
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
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login/forgot-password" className="text-sm text-violet-600 hover:text-violet-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
