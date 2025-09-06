'use client'

import { useState, useEffect, useRef } from 'react'

interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label: string
  placeholder?: string
}

export default function RangeSlider({ 
  min, 
  max, 
  value, 
  onChange, 
  label,
  placeholder 
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent, handle: 'min' | 'max') => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleTouchStart = (e: React.TouchEvent, handle: 'min' | 'max') => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const width = rect.width
    const percentage = Math.max(0, Math.min(1, x / width))
    const newValue = Math.round(min + percentage * (max - min))

    if (isDragging === 'min') {
      const newMin = Math.min(newValue, value[1] - 1)
      onChange([newMin, value[1]])
    } else {
      const newMax = Math.max(newValue, value[0] + 1)
      onChange([value[0], newMax])
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    updateValue(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return
    e.preventDefault()
    updateValue(e.touches[0].clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  const handleTouchEnd = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, value])

  const minPercentage = ((value[0] - min) / (max - min)) * 100
  const maxPercentage = ((value[1] - min) / (max - min)) * 100

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      
      {/* Slider */}
      <div className="relative mb-4">
        <div
          ref={sliderRef}
          className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
        >
          {/* Track de rango seleccionado */}
          <div
            className="absolute h-2 bg-violet-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
          />
          
          {/* Handle mínimo */}
          <div
            className="absolute w-6 h-6 bg-violet-600 rounded-full shadow-lg cursor-grab active:cursor-grabbing transform -translate-y-2 hover:scale-110 transition-transform"
            style={{ left: `${minPercentage}%` }}
            onMouseDown={(e) => handleMouseDown(e, 'min')}
            onTouchStart={(e) => handleTouchStart(e, 'min')}
          />
          
          {/* Handle máximo */}
          <div
            className="absolute w-6 h-6 bg-violet-600 rounded-full shadow-lg cursor-grab active:cursor-grabbing transform -translate-y-2 hover:scale-110 transition-transform"
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={(e) => handleMouseDown(e, 'max')}
            onTouchStart={(e) => handleTouchStart(e, 'max')}
          />
        </div>
        
        {/* Marcadores de edad */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{min} años</span>
          <span>{max} años</span>
        </div>
      </div>

      {/* Valores seleccionados - Solo mostrar los valores sin campos de entrada */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-violet-600">{value[0]}</div>
          <div className="text-xs text-gray-500">años</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-violet-600">{value[1]}</div>
          <div className="text-xs text-gray-500">años</div>
        </div>
      </div>
    </div>
  )
}
