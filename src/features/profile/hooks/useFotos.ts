'use client'

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchFotos, uploadFoto, deleteFoto, reorderFotos } from '@/store/sliceProfile'
import { supabase } from '@/lib/supabase'

export function useFotos() {
  const dispatch = useAppDispatch()
  const { fotos, loading, uploading, error } = useAppSelector((state) => state.fotos)

  const cargarFotos = useCallback(async (userId: string) => {
    try {
      await dispatch(fetchFotos(userId)).unwrap()
    } catch (error) {
      console.error('Error al cargar fotos:', error)
    }
  }, [dispatch])

  const subirFoto = useCallback(async (userId: string, file: File, position: number) => {
    try {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.')
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB.')
      }

      await dispatch(uploadFoto({ userId, file, position })).unwrap()
    } catch (error) {
      console.error('Error al subir foto:', error)
      throw error
    }
  }, [dispatch])

  const eliminarFoto = useCallback(async (fotoId: string, path: string) => {
    try {
      await dispatch(deleteFoto({ fotoId, path })).unwrap()
    } catch (error) {
      console.error('Error al eliminar foto:', error)
      throw error
    }
  }, [dispatch])

  const reordenarFotos = useCallback(async (fotosConNuevaPosicion: { id: string; position: number }[]) => {
    try {
      await dispatch(reorderFotos({ fotos: fotosConNuevaPosicion })).unwrap()
    } catch (error) {
      console.error('Error al reordenar fotos:', error)
      throw error
    }
  }, [dispatch])

  const obtenerUrlPublica = useCallback((path: string) => {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)
    return data.publicUrl
  }, [])

  return {
    fotos,
    loading,
    uploading,
    error,
    cargarFotos,
    subirFoto,
    eliminarFoto,
    reordenarFotos,
    obtenerUrlPublica
  }
}
