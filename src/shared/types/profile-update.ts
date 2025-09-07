export type ProfileUpdateInput = {
  id: string
  nombre_completo?: string | null
  descripcion?: string | null
  edad?: number | null
  altura?: number | null
  genero_primario_id?: string | null
  genero_secundario_id?: string | null
  que_busco_id?: string | null
  ubicacion_id?: string | null
  escuela_coaching_id?: string | null
  orientacion_sexual_id?: string | null
  edad_min?: number | null
  edad_max?: number | null
  distancia_maxima?: number | null
  info_basica_cargada?: boolean
}
