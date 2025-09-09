'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import AppGuard from '@/components/auth/AppGuard'

// Mock data - después vendrá de Supabase
const mockMatches = [
  {
    id: '1',
    user: {
      id: 'user1',
      nombre_completo: 'María González',
      foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    lastMessage: {
      content: '¡Hola! ¿Cómo estás?',
      timestamp: '2024-01-15T10:30:00Z',
      isFromMe: false
    },
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    user: {
      id: 'user2',
      nombre_completo: 'Carlos Rodríguez',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    lastMessage: {
      content: 'Perfecto, nos vemos mañana entonces',
      timestamp: '2024-01-15T09:15:00Z',
      isFromMe: true
    },
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    user: {
      id: 'user3',
      nombre_completo: 'Ana Martínez',
      foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    lastMessage: {
      content: 'Me encanta esa película también!',
      timestamp: '2024-01-14T20:45:00Z',
      isFromMe: false
    },
    unreadCount: 1,
    isOnline: true
  }
]

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState(mockMatches)
  const [loading, setLoading] = useState(false)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Ahora'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else if (diffInHours < 48) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
    }
  }

  const handleMatchClick = (matchId: string) => {
    router.push(`/chat/${matchId}`)
  }

  return (
    <AppGuard>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-2xl mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Matches</h1>
              <p className="text-gray-600">
                {matches.length} conversación{matches.length !== 1 ? 'es' : ''}
              </p>
            </div>

            {/* Matches List */}
            <div className="space-y-2">
              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No tenés matches aún
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Seguí haciendo swipe para encontrar tu match perfecto
                  </p>
                  <button
                    onClick={() => router.push('/swipes')}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Ir a Swipes
                  </button>
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match.id)}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Profile Photo */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                          <img
                            src={match.user.foto}
                            alt={match.user.nombre_completo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Online Status */}
                        {match.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Match Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {match.user.nombre_completo}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(match.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            match.lastMessage.isFromMe 
                              ? 'text-gray-600' 
                              : match.unreadCount > 0 
                                ? 'text-gray-900 font-medium' 
                                : 'text-gray-600'
                          }`}>
                            {match.lastMessage.isFromMe && 'Tú: '}
                            {match.lastMessage.content}
                          </p>
                          
                          {/* Unread Badge */}
                          {match.unreadCount > 0 && (
                            <div className="ml-2 bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                              {match.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </AppGuard>
  )
}

