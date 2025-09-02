'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updatePassword, clearError } from '@/store/sliceAuth/authSlice'
import { Heart, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '@/shared/utils/passwordValidation'
import { supabase } from '@/lib/supabase'
import { useSupabaseAuth } from '@/features/auth/hooks/useSupabaseAuth'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { user, session, loading: authLoading } = useSupabaseAuth()

  // Limpiar errores al entrar a la página
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Verificar si tenemos una sesión válida (viene del email de reset)
  useEffect(() => {
    // Si tenemos una sesión activa, consideramos que el token es válido
    if (session && user) {
      setIsValidToken(true)
    } else {
      // Verificar si hay tokens en la URL
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        // Configurar la sesión de Supabase con los tokens
        const setupSession = async () => {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('Error setting session:', error)
              setIsValidToken(false)
            } else {
              setIsValidToken(true)
            }
          } catch (error) {
            console.error('Error setting session:', error)
            setIsValidToken(false)
          }
        }
        
        setupSession()
      } else {
        setIsValidToken(false)
      }
    }
  }, [searchParams, session, user])

  // Validar contraseña en tiempo real
  useEffect(() => {
    if (password) {
      setPasswordValidation(validatePassword(password))
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordValidation.isValid) {
      return
    }
    
    if (password !== confirmPassword) {
      return
    }

    try {
      await dispatch(updatePassword({ password })).unwrap()
      // Redirigir al login después de cambiar la contraseña
      router.push('/login/signin?message=password-changed')
    } catch (error) {
      // El error se maneja en el slice
    }
  }

  const getRequirementIcon = (isMet: boolean) => {
    return isMet ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-400" />
    )
  }

  const requirements = [
    { text: 'Al menos 8 caracteres', met: password.length >= 8 },
    { text: 'Al menos un número', met: /\d/.test(password) },
    { text: 'Al menos un símbolo', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    { text: 'Al menos una mayúscula', met: /[A-Z]/.test(password) },
    { text: 'Al menos una minúscula', met: /[a-z]/.test(password) }
  ]

  // Mostrar loading mientras se valida la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-medium text-gray-900">
            Verificando enlace...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Enlace Inválido
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              El enlace para restablecer la contraseña no es válido o ha expirado.
            </p>
            <div className="mt-6">
              <Link 
                href="/login/forgot-password" 
                className="text-violet-600 hover:text-violet-500 font-medium"
              >
                Solicitar nuevo enlace
              </Link>
            </div>
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
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Establece una nueva contraseña para tu cuenta
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setTimeout(() => setShowPasswordRequirements(false), 200)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm ${
                    password ? (passwordValidation.isValid ? 'border-green-300 focus:ring-green-500' : 'border-red-300 focus:ring-red-500') : 'border-gray-300 focus:ring-violet-500'
                  }`}
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
              
              {/* Indicador de fortaleza */}
              {password && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Fortaleza:</span>
                  <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                    {getPasswordStrengthText(passwordValidation.strength)}
                  </span>
                </div>
              )}

              {/* Requisitos de contraseña */}
              {showPasswordRequirements && password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
                  <div className="space-y-1">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {getRequirementIcon(req.met)}
                        <span className={`text-xs ${req.met ? 'text-gray-600' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nueva Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm ${
                    confirmPassword ? (password === confirmPassword ? 'border-green-300 focus:ring-green-500' : 'border-red-300 focus:ring-red-500') : 'border-gray-300 focus:ring-violet-500'
                  }`}
                  placeholder="••••••••"
                  suppressHydrationWarning={true}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    suppressHydrationWarning={true}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Indicador de coincidencia */}
              {confirmPassword && (
                <div className="mt-2 flex items-center space-x-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Las contraseñas coinciden</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">Las contraseñas no coinciden</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning={true}
            >
              {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/login/signin" 
              className="text-violet-600 hover:text-violet-500 text-sm"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
