'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchFotos, uploadFoto, deleteFoto, reorderFotos } from '@/store/sliceProfile'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function FotosPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.profile)
  const { fotos, loading, uploading, error } = useAppSelector((state) => state.fotos)
  
  const [dragOver, setDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Cargar fotos al montar
  useEffect(() => {
    if (profile?.id) {
      dispatch(fetchFotos(profile.id))
    }
  }, [dispatch, profile?.id])

  // Manejar selección de archivos
  const handleFileSelect = (files: FileList | null) => {
    console.log('handleFileSelect llamado con:', files)
    if (!files) {
      console.log('No hay archivos seleccionados')
      return
    }
    
    console.log('Archivos seleccionados:', Array.from(files).map(f => f.name))
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const isValid = validTypes.includes(file.type)
      console.log(`Archivo ${file.name}: tipo ${file.type}, válido: ${isValid}`)
      return isValid
    })
    
    console.log('Archivos válidos:', validFiles.map(f => f.name))
    setSelectedFiles(prev => {
      const newFiles = [...prev, ...validFiles]
      console.log('Total archivos seleccionados:', newFiles.length)
      return newFiles
    })
  }

  // Manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Subir fotos
  const handleUpload = async () => {
    console.log('handleUpload llamado')
    console.log('profile?.id:', profile?.id)
    console.log('selectedFiles.length:', selectedFiles.length)
    
    if (!profile?.id || selectedFiles.length === 0) {
      console.log('No se puede subir: falta profile.id o archivos seleccionados')
      return
    }

    console.log('Iniciando subida de fotos...')
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const position = fotos.length + i + 1
      
      console.log(`Subiendo foto ${i + 1}:`, file.name, 'posición:', position)
      
      try {
        await dispatch(uploadFoto({ 
          userId: profile.id, 
          file, 
          position 
        })).unwrap()
        console.log(`Foto ${i + 1} subida exitosamente`)
      } catch (error) {
        console.error('Error al subir foto:', error)
      }
    }
    
    console.log('Limpiando archivos seleccionados')
    setSelectedFiles([])
  }

  // Eliminar foto
  const handleDelete = async (fotoId: string, path: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar esta foto?')) return
    
    try {
      await dispatch(deleteFoto({ fotoId, path })).unwrap()
    } catch (error) {
      console.error('Error al eliminar foto:', error)
    }
  }

  // Reordenar fotos
  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newFotos = [...fotos]
    const [movedFoto] = newFotos.splice(fromIndex, 1)
    newFotos.splice(toIndex, 0, movedFoto)
    
    // Actualizar posiciones
    const fotosConNuevaPosicion = newFotos.map((foto, index) => ({
      id: foto.id,
      position: index + 1
    }))
    
    try {
      await dispatch(reorderFotos({ fotos: fotosConNuevaPosicion })).unwrap()
    } catch (error) {
      console.error('Error al reordenar fotos:', error)
    }
  }

  const canAddMore = fotos.length + selectedFiles.length < 6

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Mis Fotos</h1>
          <p className="text-gray-600 mt-2">
            Subí entre 3 y 6 fotos. Podés arrastrar para reordenarlas.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Indicador de carga global */}
        {uploading && (
          <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div>
                <p className="text-violet-800 font-semibold">Subiendo fotos...</p>
                <p className="text-violet-600 text-sm">No cierres esta página mientras se suben las fotos</p>
              </div>
            </div>
          </div>
        )}

        {/* Fotos actuales */}
        {fotos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Fotos actuales ({fotos.length}/6)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotos.map((foto, index) => (
                <div key={foto.id} className="relative group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={foto.path}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Overlay con controles */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <button
                        onClick={() => handleDelete(foto.id, foto.path)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                        title="Eliminar foto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Número de posición */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Área de subida */}
        {canAddMore && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Agregar fotos
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                dragOver 
                  ? 'border-violet-500 bg-violet-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <p className="text-lg text-gray-600 mb-2">
                Arrastrá fotos aquí o hacé clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 mb-4">
                JPG, PNG, WebP. Máximo 6 fotos en total.
              </p>
              
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
              >
                Seleccionar archivos
              </label>
            </div>
          </div>
        )}

        {/* Archivos seleccionados */}
        {selectedFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Archivos seleccionados ({selectedFiles.length})
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {uploading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {uploading ? 'Subiendo...' : 'Subir fotos'}
            </button>
            
            {/* Indicador de carga más visible */}
            {uploading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium">Subiendo fotos...</p>
                    <p className="text-blue-600 text-sm">Por favor esperá, esto puede tomar unos segundos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Consejos para tus fotos:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usá fotos recientes y de buena calidad</li>
            <li>• Mostrá tu cara claramente en al menos una foto</li>
            <li>• Incluí fotos que muestren tu personalidad</li>
            <li>• Evitá fotos con otras personas o muy oscuras</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
