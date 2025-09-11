'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SwipeProfile } from '@/core/feed/types'
import { formatLocation, formatProfessionalInfo, getPrimaryPhoto, getAllPhotos } from '@/core/feed/service'

interface SwipeCardProps {
  profile: SwipeProfile
  onLike: (userId: string) => void
  onDislike: (userId: string) => void
  isLoading?: boolean
}

export default function SwipeCard({ profile, onLike, onDislike, isLoading = false }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  
  const photos = getAllPhotos(profile)
  const primaryPhoto = getPrimaryPhoto(profile)
  const location = formatLocation(profile)
  const professionalInfo = formatProfessionalInfo(profile)

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev > 0 ? prev - 1 : photos.length - 1
    )
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev < photos.length - 1 ? prev + 1 : 0
    )
  }

  const handleLike = () => {
    onLike(profile.user_id)
  }

  const handleDislike = () => {
    onDislike(profile.user_id)
  }

  if (!primaryPhoto) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Sin fotos</p>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {profile.nombre_completo || 'Usuario'}
          </h2>
          <p className="text-gray-600">No hay información disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      {/* Photo Section */}
      <div className="relative h-96">
        <Image
          src={photos[currentPhotoIndex]}
          alt={profile.nombre_completo || 'Usuario'}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
        
        {/* Loading overlay */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}
        
        {/* Photo navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePreviousPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              aria-label="Foto anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              aria-label="Foto siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Photo indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`Ir a foto ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Processing overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm">Procesando...</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.nombre_completo || 'Usuario'}, {profile.edad || '?'}
          </h2>
          <span className="text-gray-500 text-sm">
            📍 {location}
          </span>
        </div>

        {/* Basic Info */}
        <div className="mb-4 space-y-1">
          {profile.genero_primario && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Género:</span> {profile.genero_primario}
              {profile.genero_secundario && `, ${profile.genero_secundario}`}
            </p>
          )}
          
          {profile.orientacion_sexual && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Orientación:</span> {profile.orientacion_sexual}
            </p>
          )}
          
          {profile.que_busco && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Busca:</span> {profile.que_busco}
            </p>
          )}
          
          {profile.altura && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Altura:</span> {profile.altura} cm
            </p>
          )}
        </div>

        {/* Professional Info */}
        {professionalInfo && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Profesión:</span> {professionalInfo}
            </p>
          </div>
        )}

        {/* School */}
        {profile.escuela_coaching && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Escuela:</span> {profile.escuela_coaching}
            </p>
          </div>
        )}

        {/* Description */}
        {profile.descripcion && (
          <p className="text-gray-700 mb-4 leading-relaxed">
            {profile.descripcion}
          </p>
        )}

        {/* Lifestyle */}
        {profile.estilo_vida && typeof profile.estilo_vida === 'object' && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Estilo de vida</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(profile.estilo_vida).map(([key, value]) => (
                <span
                  key={key}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.intereses && profile.intereses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Intereses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.intereses.map((interes, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                >
                  {interes}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Distance */}
        {profile.distancia_km && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Distancia:</span> {profile.distancia_km.toFixed(1)} km
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
