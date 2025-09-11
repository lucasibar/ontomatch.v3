'use client'

import { useSwipeFeed } from '@/core/feed/useSwipeFeed'
import SwipeCard from './SwipeCard'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'

interface SwipeListProps {
  limit?: number
}

export default function SwipeList({ limit = 20 }: SwipeListProps) {
  const {
    items,
    isLoading,
    isError,
    isEmpty,
    hasNextPage,
    error,
    like,
    dislike,
    retry,
  } = useSwipeFeed({ limit })

  // Mostrar estado de error
  if (isError) {
    return <ErrorState error={error} onRetry={retry} />
  }

  // Mostrar estado vacío
  if (isEmpty) {
    return <EmptyState />
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Descubrir</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'perfil' : 'perfiles'} disponibles
          </p>
        </div>

        {/* Feed List */}
        <div data-feed-list>
          {items.map((profile) => (
            <SwipeCard
              key={profile.user_id}
              profile={profile}
              onLike={like}
              onDislike={dislike}
            />
          ))}
        </div>

        {/* Loading more indicator */}
        {isLoading && items.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-gray-500">
              <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando más perfiles...
            </div>
          </div>
        )}

        {/* No more profiles indicator */}
        {!hasNextPage && items.length > 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Has visto todos los perfiles!
            </h3>
            <p className="text-gray-600 mb-4">
              Vuelve mañana para descubrir más personas.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Refrescar
            </button>
          </div>
        )}

        {/* Initial loading skeleton */}
        {isLoading && items.length === 0 && <LoadingSkeleton />}
      </div>
    </div>
  )
}
