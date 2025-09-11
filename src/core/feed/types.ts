import { z } from 'zod'

// Esquema de validación para SwipeProfile
export const SwipeProfileSchema = z.object({
  user_id: z.string(),
  nombre_completo: z.string().nullable(),
  edad: z.number().nullable(),
  descripcion: z.string().nullable(),
  altura: z.number().nullable(),
  info_basica_cargada: z.boolean().nullable(),
  genero_primario: z.string().nullable(),
  genero_secundario: z.string().nullable(),
  orientacion_sexual: z.string().nullable(),
  que_busco: z.string().nullable(),
  pais: z.string().nullable(),
  provincia: z.string().nullable(),
  ciudad: z.string().nullable(),
  localidad: z.string().nullable(),
  latitud: z.number().nullable(),
  longitud: z.number().nullable(),
  escuela_coaching: z.string().nullable(),
  estilo_vida: z.record(z.unknown()).nullable(), // jsonb
  intereses: z.array(z.string()).nullable(),
  photos: z.array(z.string()).nullable(),
  empresa: z.string().nullable(),
  cargo: z.string().nullable(),
  titulo: z.string().nullable(),
  distancia_km: z.number().nullable(),
  score: z.number().nullable(),
  score_intereses: z.number().nullable(),
  score_estilo: z.number().nullable(),
  score_proximidad: z.number().nullable(),
  score_que_busco: z.number().nullable(),
  score_actividad: z.number().nullable(),
  last_activity: z.string().nullable(), // ISO
})

// Tipo TypeScript derivado del esquema
export type SwipeProfile = z.infer<typeof SwipeProfileSchema>

// Esquema para el cursor de paginación
export const FeedCursorSchema = z.object({
  after_score: z.number(),
  after_user: z.string(),
})

export type FeedCursor = z.infer<typeof FeedCursorSchema>

// Esquema para la respuesta de una página del feed
export const FeedPageSchema = z.object({
  items: z.array(SwipeProfileSchema),
  nextCursor: FeedCursorSchema.optional(),
})

export type FeedPage = z.infer<typeof FeedPageSchema>

// Parámetros para obtener el feed
export interface FeedParams {
  viewerId: string
  limit?: number
  after_score?: number
  after_user?: string
}

// Respuesta de la API
export interface FeedApiResponse {
  items: SwipeProfile[]
  nextCursor?: FeedCursor
}

// Estados del hook
export interface SwipeFeedState {
  items: SwipeProfile[]
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  hasNextPage: boolean
  error?: string
}

// Acciones del hook
export interface SwipeFeedActions {
  fetchNextPage: () => void
  like: (userId: string) => Promise<void>
  dislike: (userId: string) => Promise<void>
  retry: () => void
}
