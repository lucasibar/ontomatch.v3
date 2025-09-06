'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { initializeFromStorage } from '@/store/sliceAuth/authSlice'

export default function StoreInitializer() {
  const dispatch = useAppDispatch()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true)
    
    // Inicializar el store con la sesión guardada en localStorage
    dispatch(initializeFromStorage())
  }, [dispatch])

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return null
  }

  return null // Este componente no renderiza nada
}
