'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SwipeProfile, FeedCursor, SwipeFeedState, SwipeFeedActions } from './types'
import { mergeItems, removeItem, isEmpty } from './service'

interface UseSwipeFeedOptions {
  limit?: number
  autoFetch?: boolean
}

interface UseSwipeFeedReturn extends SwipeFeedState, SwipeFeedActions {}

export function useSwipeFeed(options: UseSwipeFeedOptions = {}): UseSwipeFeedReturn {
  const { limit = 20, autoFetch = true } = options
  
  // Estados
  const [items, setItems] = useState<SwipeProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [hasNextPage, setHasNextPage] = useState(true)
  const [nextCursor, setNextCursor] = useState<FeedCursor | undefined>()
  
  // Refs para evitar llamadas duplicadas
  const isLoadingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  // Función para obtener el feed
  const fetchFeed = useCallback(async (cursor?: FeedCursor, append = false) => {
    if (isLoadingRef.current) return
    
    try {
      isLoadingRef.current = true
      setIsLoading(true)
      setIsError(false)
      setError(undefined)

      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(cursor && {
          after_score: cursor.after_score.toString(),
          after_user: cursor.after_user,
        }),
      })

      const response = await fetch(`/api/feed?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cargar el feed')
      }

      const data = await response.json()
      
      if (append) {
        setItems(prev => mergeItems(prev, data.items))
      } else {
        setItems(data.items)
      }
      
      setNextCursor(data.nextCursor)
      setHasNextPage(!!data.nextCursor)
      
    } catch (err) {
      console.error('Error fetching feed:', err)
      setIsError(true)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [limit])

  // Función para cargar la siguiente página
  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isLoading && nextCursor) {
      fetchFeed(nextCursor, true)
    }
  }, [hasNextPage, isLoading, nextCursor, fetchFeed])

  // Función para registrar interacción
  const recordInteraction = useCallback(async (toUserId: string, interactionType: 'like' | 'dislike') => {
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId,
          interactionType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al registrar interacción')
      }

      return true
    } catch (err) {
      console.error('Error recording interaction:', err)
      throw err
    }
  }, [])

  // Función para like
  const like = useCallback(async (userId: string) => {
    // Optimistic update: remover el item inmediatamente
    setItems(prev => removeItem(prev, userId))
    
    try {
      await recordInteraction(userId, 'like')
    } catch (err) {
      // Si falla, revertir el cambio
      console.error('Error al dar like, revirtiendo cambio:', err)
      // Aquí podrías implementar una lógica para restaurar el item
      // Por ahora, simplemente logueamos el error
    }
  }, [recordInteraction])

  // Función para dislike
  const dislike = useCallback(async (userId: string) => {
    // Optimistic update: remover el item inmediatamente
    setItems(prev => removeItem(prev, userId))
    
    try {
      await recordInteraction(userId, 'dislike')
    } catch (err) {
      // Si falla, revertir el cambio
      console.error('Error al dar dislike, revirtiendo cambio:', err)
      // Aquí podrías implementar una lógica para restaurar el item
      // Por ahora, simplemente logueamos el error
    }
  }, [recordInteraction])

  // Función para reintentar
  const retry = useCallback(() => {
    setIsError(false)
    setError(undefined)
    fetchFeed()
  }, [fetchFeed])

  // Cargar datos iniciales
  useEffect(() => {
    if (autoFetch && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      fetchFeed()
    }
  }, [autoFetch, fetchFeed])

  // Infinite scroll con Intersection Observer
  useEffect(() => {
    if (!hasNextPage || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    // Crear un elemento invisible al final de la lista para observar
    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    sentinel.style.width = '100%'
    
    // Buscar el contenedor de la lista (asumiendo que existe)
    const listContainer = document.querySelector('[data-feed-list]')
    if (listContainer) {
      listContainer.appendChild(sentinel)
      observer.observe(sentinel)
    }

    return () => {
      observer.disconnect()
      if (sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel)
      }
    }
  }, [hasNextPage, isLoading, fetchNextPage])

  // Calcular estados derivados
  const isEmptyState = isEmpty(items, isLoading)

  return {
    // Estados
    items,
    isLoading,
    isError,
    isEmpty: isEmptyState,
    hasNextPage,
    error,
    
    // Acciones
    fetchNextPage,
    like,
    dislike,
    retry,
  }
}
