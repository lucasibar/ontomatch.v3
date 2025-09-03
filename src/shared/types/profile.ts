export interface Profile {
  id: string
  nombre_completo: string
  email: string
  descripcion: string | null
  edad: number | null
  altura: number | null
  genero_primario_id: string | null
  genero_secundario_id: string | null
  ubicacion_id: string | null
  opciones_que_busco_id: string | null
  orientacion_sexual_id: string | null
  edad_min: number | null
  edad_max: number | null
  distancia_maxima: number | null
  empresa: string | null
  cargo: string | null
  escuela_coaching_id: string | null
  info_basica_cargada: boolean
  created_at: string | null
  updated_at: string | null
}

export interface GeneroPrimario {
  id: string
  nombre: string
}

export interface GeneroSecundario {
  id: string
  nombre: string
  genero_primario_id: string
}

export interface ProfileFormData {
  nombre_completo: string
  descripcion: string
  edad: number
  altura: number | null
  genero_primario_id: string
  genero_secundario_id: string
  ubicacion_id: string
  opciones_que_busco_id: string
  orientacion_sexual_id: string
  edad_min: number
  edad_max: number
  distancia_maxima: number
  empresa: string
  cargo: string
  escuela_coaching_id: string
}

export interface Ubicacion {
  id: string
  pais: string
  provincia: string
  ciudad: string
  localidad: string | null
  latitud: string
  longitud: string
  created_at: string | null
}

// CAMPOS OBLIGATORIOS PARA VALIDACIÓN
export const REQUIRED_FIELDS: (keyof ProfileFormData)[] = [
  'nombre_completo',
  'genero_primario_id',
  'ubicacion_id',
  'escuela_coaching_id',
  'opciones_que_busco_id',
  'edad_min',
  'edad_max',
  'distancia_maxima'
]
