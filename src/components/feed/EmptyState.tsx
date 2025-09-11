import Link from 'next/link'

export default function EmptyState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Aún no hay perfiles para mostrar
        </h2>
        
        <p className="text-gray-600 mb-6">
          Probá ampliar tu rango de edad o distancia en Preferencias.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/perfil"
            className="block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Abrir Preferencias
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            Refrescar
          </button>
        </div>
      </div>
    </div>
  )
}
