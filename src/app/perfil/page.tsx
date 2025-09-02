'use client'

import { useAppSelector } from '@/store/hooks'
import { Heart, LogOut, User } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useLogout } from '@/features/auth/hooks/useLogout'

export default function PerfilPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { handleLogout } = useLogout()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-violet-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-violet-600 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">OntoMatch</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user?.user_metadata?.full_name || user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-violet-600 rounded-full flex items-center justify-center mb-8">
              <Heart className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-6xl font-bold text-gray-900 mb-4">
              OntoMatch
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              ¡Bienvenido a tu aplicación de citas!
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Información de tu cuenta
              </h3>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Nombre:</span>
                  <span className="text-gray-900">
                    {user?.user_metadata?.full_name || 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email confirmado:</span>
                  <span className={`${user?.email_confirmed_at ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.email_confirmed_at ? 'Sí' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Miembro desde:</span>
                  <span className="text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
