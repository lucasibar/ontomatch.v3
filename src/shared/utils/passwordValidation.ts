export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  
  // Verificar longitud mínima
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  // Verificar si contiene números
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número')
  }
  
  // Verificar si contiene símbolos
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un símbolo')
  }
  
  // Verificar si contiene mayúsculas
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula')
  }
  
  // Verificar si contiene minúsculas
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula')
  }
  
  // Calcular fortaleza
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (password.length >= 8 && errors.length <= 2) {
    strength = 'medium'
  }
  if (password.length >= 10 && errors.length <= 1) {
    strength = 'strong'
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

export function getPasswordStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'text-red-500'
    case 'medium':
      return 'text-yellow-500'
    case 'strong':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

export function getPasswordStrengthText(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'Débil'
    case 'medium':
      return 'Media'
    case 'strong':
      return 'Fuerte'
    default:
      return 'Desconocida'
  }
}
