'use client'

import Link from 'next/link'

export default function ProfileIncompleteAlert() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card de alerta */}
        <div className="bg-white rounded-lg shadow-lg border border-violet-200 p-8 text-center">
          {/* Icono de alerta */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 mb-6">
            <svg
              className="h-10 w-10 text-violet-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ¡Completa tu perfil!
          </h2>

          {/* Mensaje */}
          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
            Para encontrar tu match perfecto, necesitamos conocer un poco más sobre vos. 
            <br />
            <span className="font-medium text-violet-600">Solo te tomará unos minutos.</span>
          </p>

          {/* Botón de acción */}
          <Link
            href="/perfil"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Completar Perfil
          </Link>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              <strong>Campos obligatorios:</strong> Nombre completo, género, ubicación, escuela de coaching, qué buscas, rango de edad y distancia máxima.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
