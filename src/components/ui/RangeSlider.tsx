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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
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

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
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
          />
          
          {/* Handle máximo */}
          <div
            className="absolute w-6 h-6 bg-violet-600 rounded-full shadow-lg cursor-grab active:cursor-grabbing transform -translate-y-2 hover:scale-110 transition-transform"
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={(e) => handleMouseDown(e, 'max')}
          />
        </div>
        
        {/* Marcadores de edad */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{min} años</span>
          <span>{max} años</span>
        </div>
      </div>

      {/* Valores seleccionados */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={min}
            max={value[1] - 1}
            value={value[0]}
            onChange={(e) => {
              const newMin = parseInt(e.target.value) || min
              onChange([Math.min(newMin, value[1] - 1), value[1]])
            }}
            className="w-16 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-sm text-gray-600">años</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={value[0] + 1}
            max={max}
            value={value[1]}
            onChange={(e) => {
              const newMax = parseInt(e.target.value) || max
              onChange([value[0], Math.max(newMax, value[0] + 1)])
            }}
            className="w-16 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-sm text-gray-600">años</span>
        </div>
      </div>
    </div>
  )
}
