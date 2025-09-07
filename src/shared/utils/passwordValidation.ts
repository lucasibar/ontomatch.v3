export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';

// Constantes para validación de contraseña
const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  STRONG_MIN_LENGTH: 10,
  MAX_ERRORS_FOR_MEDIUM: 2,
  MAX_ERRORS_FOR_STRONG: 1
} as const;

const PASSWORD_PATTERNS = {
  NUMBER: /\d/,
  SYMBOL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/
} as const;

const ERROR_MESSAGES = {
  MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
  NUMBER: 'La contraseña debe contener al menos un número',
  SYMBOL: 'La contraseña debe contener al menos un símbolo',
  UPPERCASE: 'La contraseña debe contener al menos una mayúscula',
  LOWERCASE: 'La contraseña debe contener al menos una minúscula'
} as const;

const STRENGTH_COLORS = {
  weak: 'text-red-500',
  medium: 'text-yellow-500',
  strong: 'text-green-500'
} as const;

const STRENGTH_TEXTS = {
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte'
} as const;

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  
  // Verificar longitud mínima
  if (password.length < PASSWORD_RULES.MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.MIN_LENGTH)
  }
  
  // Verificar patrones requeridos
  if (!PASSWORD_PATTERNS.NUMBER.test(password)) {
    errors.push(ERROR_MESSAGES.NUMBER)
  }
  
  if (!PASSWORD_PATTERNS.SYMBOL.test(password)) {
    errors.push(ERROR_MESSAGES.SYMBOL)
  }
  
  if (!PASSWORD_PATTERNS.UPPERCASE.test(password)) {
    errors.push(ERROR_MESSAGES.UPPERCASE)
  }
  
  if (!PASSWORD_PATTERNS.LOWERCASE.test(password)) {
    errors.push(ERROR_MESSAGES.LOWERCASE)
  }
  
  // Calcular fortaleza
  const strength = calculatePasswordStrength(password, errors.length)
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

function calculatePasswordStrength(password: string, errorCount: number): PasswordStrength {
  if (password.length >= PASSWORD_RULES.STRONG_MIN_LENGTH && errorCount <= PASSWORD_RULES.MAX_ERRORS_FOR_STRONG) {
    return 'strong'
  }
  
  if (password.length >= PASSWORD_RULES.MIN_LENGTH && errorCount <= PASSWORD_RULES.MAX_ERRORS_FOR_MEDIUM) {
    return 'medium'
  }
  
  return 'weak'
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  return STRENGTH_COLORS[strength] || 'text-gray-500'
}

export function getPasswordStrengthText(strength: PasswordStrength): string {
  return STRENGTH_TEXTS[strength] || 'Desconocida'
}
