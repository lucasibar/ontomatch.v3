'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { initializeFromStorage } from '@/store/sliceAuth/authSlice'

export default function StoreInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Inicializar el store con la sesión guardada en localStorage
    dispatch(initializeFromStorage())
  }, [dispatch])

  return null // Este componente no renderiza nada
}
