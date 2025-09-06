'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signUp, clearError } from '@/store/sliceAuth/authSlice'
import { Heart, Mail, User, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '@/shared/utils/passwordValidation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  
  const router = useRouter()
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
      await dispatch(signUp({ email, password, fullName })).unwrap()
      // Redirigir a la página de confirmación de email
      router.push('/login/confirm-email')
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

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            OntoMatch
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login/signin" className="text-violet-600 hover:text-violet-500">
              Inicia sesión aquí
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
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <div className="mt-1 relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Tu nombre completo"
                  suppressHydrationWarning={true}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
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
                Confirmar Contraseña
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
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Al crear una cuenta, aceptas nuestros términos y condiciones
          </div>
        </form>
      </div>
    </div>
  )
}
