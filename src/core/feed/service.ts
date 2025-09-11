import type { SwipeProfile, FeedCursor } from './types'

/**
 * Calcula el cursor para la siguiente página basado en el último elemento
 */
export function getNextCursor(items: SwipeProfile[]): FeedCursor | undefined {
  if (items.length === 0) return undefined
  
  const lastItem = items[items.length - 1]
  
  if (lastItem.score === null || !lastItem.user_id) {
    return undefined
  }
  
  return {
    after_score: lastItem.score,
    after_user: lastItem.user_id,
  }
}

/**
 * Determina si el feed está vacío (sin items y no cargando)
 */
export function isEmpty(items: SwipeProfile[], isLoading: boolean): boolean {
  return items.length === 0 && !isLoading
}

/**
 * Determina si hay más páginas disponibles
 */
export function hasNextPage(items: SwipeProfile[], limit: number): boolean {
  return items.length >= limit
}

/**
 * Filtra items duplicados por user_id
 */
export function deduplicateItems(items: SwipeProfile[]): SwipeProfile[] {
  const seen = new Set<string>()
  return items.filter(item => {
    if (seen.has(item.user_id)) {
      return false
    }
    seen.add(item.user_id)
    return true
  })
}

/**
 * Combina dos arrays de items sin duplicados
 */
export function mergeItems(existing: SwipeProfile[], newItems: SwipeProfile[]): SwipeProfile[] {
  const combined = [...existing, ...newItems]
  return deduplicateItems(combined)
}

/**
 * Remueve un item por user_id (para optimistic updates)
 */
export function removeItem(items: SwipeProfile[], userId: string): SwipeProfile[] {
  return items.filter(item => item.user_id !== userId)
}

/**
 * Formatea la ubicación del usuario
 */
export function formatLocation(profile: SwipeProfile): string {
  const parts = [
    profile.ciudad,
    profile.provincia,
    profile.pais
  ].filter(Boolean)
  
  return parts.length > 0 ? parts.join(', ') : 'Ubicación no especificada'
}

/**
 * Formatea la información profesional
 */
export function formatProfessionalInfo(profile: SwipeProfile): string | null {
  const parts = [
    profile.cargo,
    profile.empresa
  ].filter(Boolean)
  
  return parts.length > 0 ? parts.join(' en ') : null
}

/**
 * Obtiene la primera foto disponible
 */
export function getPrimaryPhoto(profile: SwipeProfile): string | null {
  if (!profile.photos || profile.photos.length === 0) {
    return null
  }
  
  return profile.photos[0]
}

/**
 * Obtiene todas las fotos disponibles
 */
export function getAllPhotos(profile: SwipeProfile): string[] {
  return profile.photos || []
}
