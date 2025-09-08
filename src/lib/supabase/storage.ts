import { supabase } from '../supabase'

export const BUCKET_NAME = 'avatars'

// Verificar si el bucket existe y está configurado correctamente
export async function verificarBucketAvatars() {
  try {
    const { data, error } = await supabase.storage.getBucket(BUCKET_NAME)
    
    if (error) {
      console.error('Error al verificar bucket avatars:', error)
      return false
    }
    
    console.log('Bucket avatars configurado correctamente:', data)
    return true
  } catch (error) {
    console.error('Error inesperado al verificar bucket:', error)
    return false
  }
}

// Crear el bucket si no existe (solo para desarrollo)
export async function crearBucketAvatars() {
  try {
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (error) {
      console.error('Error al crear bucket avatars:', error)
      return false
    }
    
    console.log('Bucket avatars creado:', data)
    return true
  } catch (error) {
    console.error('Error inesperado al crear bucket:', error)
    return false
  }
}

// Subir archivo al bucket avatars
export async function subirArchivo(file: File, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error al subir archivo:', error)
    throw error
  }
}

// Eliminar archivo del bucket avatars
export async function eliminarArchivo(path: string) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    throw error
  }
}

// Obtener URL pública de un archivo
export function obtenerUrlPublica(path: string) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Listar archivos de un usuario
export async function listarArchivosUsuario(userId: string) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error al listar archivos del usuario:', error)
    throw error
  }
}
