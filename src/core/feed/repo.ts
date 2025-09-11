import { createSupabaseServerClient } from '@/lib/supabase/client-server'
import { SwipeProfileSchema, FeedPageSchema, type FeedParams, type FeedPage } from './types'

/**
 * Obtiene una página del feed de swipes desde la RPC de Supabase
 */
export async function fetchFeedPage(params: FeedParams): Promise<FeedPage> {
  const { viewerId, limit = 20, after_score, after_user } = params
  
  try {
    const supabase = createSupabaseServerClient()
    
    // Llamar a la RPC con los parámetros
    const { data: rpcData, error: rpcError } = await supabase.rpc('recommend_swipe_feed', {
      viewer: viewerId,
      page_limit: limit,
      after_score: after_score || null,
      after_user: after_user || null,
    })

    if (rpcError) {
      console.error('Error en RPC recommend_swipe_feed:', rpcError)
      
      // Si hay error de permisos o la RPC no existe, usar fallback
      if (rpcError.message.includes('permission denied') || 
          rpcError.message.includes('function') || 
          rpcError.message.includes('does not exist')) {
        console.log('RPC no disponible, usando fallback con queries directas...')
        return await fetchFeedPageFallback(params)
      }
      
      throw new Error(`Error al obtener el feed: ${rpcError.message}`)
    }

    if (!rpcData || !Array.isArray(rpcData)) {
      throw new Error('Respuesta inválida de la RPC')
    }

    // Validar cada perfil con Zod
    const validatedProfiles = rpcData.map((profile: any) => {
      try {
        return SwipeProfileSchema.parse(profile)
      } catch (validationError) {
        console.error('Error validando perfil:', validationError, profile)
        throw new Error('Datos de perfil inválidos')
      }
    })

    // Calcular el cursor para la siguiente página
    let nextCursor = undefined
    if (validatedProfiles.length === limit && validatedProfiles.length > 0) {
      const lastProfile = validatedProfiles[validatedProfiles.length - 1]
      if (lastProfile.score !== null && lastProfile.user_id) {
        nextCursor = {
          after_score: lastProfile.score,
          after_user: lastProfile.user_id,
        }
      }
    }

    const result: FeedPage = {
      items: validatedProfiles,
      nextCursor,
    }

    // Validar la respuesta completa
    return FeedPageSchema.parse(result)
  } catch (error) {
    console.error('Error en fetchFeedPage:', error)
    throw error
  }
}

/**
 * Fallback cuando la RPC no está disponible - obtiene perfiles con joins
 */
async function fetchFeedPageFallback(params: FeedParams): Promise<FeedPage> {
  const { viewerId, limit = 20 } = params
  
  try {
    const supabase = createSupabaseServerClient()
    
    // Obtener perfiles con joins para obtener los nombres de las tablas relacionadas
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        nombre_completo,
        edad,
        descripcion,
        altura,
        info_basica_cargada,
        created_at,
        updated_at,
        genero_primario:genero_primario_id(nombre),
        genero_secundario:genero_secundario_id(nombre),
        orientacion_sexual:orientacion_sexual_id(nombre),
        que_busco:que_busco_id(nombre),
        ubicacion:ubicacion_id(pais, provincia, ciudad, localidad, latitud, longitud),
        escuela_coaching:escuela_coaching_id(nombre),
        info_profesional:info_profesional_id(empresa, cargo, titulo),
        estilo_vida:estilo_vida_id(
          hijos:hijos_id(nombre),
          frecuencia_alcohol:frecuencia_alcohol_id(nombre),
          frecuencia_fumar:frecuencia_fumar_id(nombre),
          ejercicio:ejercicio_id(nombre),
          redes_sociales:redes_sociales_id(nombre),
          habitos_sueno:habitos_sueno_id(nombre),
          signo_zodiacal:signo_zodiacal_id(nombre),
          mascotas:mascotas_id(nombre),
          habitos_alimentacion:habitos_alimentacion_id(nombre)
        ),
        intereses:intereses_ids(nombre)
      `)
      .neq('id', viewerId)
      .not('nombre_completo', 'is', null)
      .not('edad', 'is', null)
      .eq('info_basica_cargada', true)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error en fallback query:', error)
      throw new Error(`Error al obtener perfiles: ${error.message}`)
    }

    if (!data || !Array.isArray(data)) {
      return { items: [], nextCursor: undefined }
    }

    // Transformar datos a formato SwipeProfile
    const profiles = data.map((profile: any) => ({
      user_id: profile.id,
      nombre_completo: profile.nombre_completo,
      edad: profile.edad,
      descripcion: profile.descripcion,
      altura: profile.altura,
      info_basica_cargada: profile.info_basica_cargada,
      genero_primario: profile.genero_primario?.nombre || null,
      genero_secundario: profile.genero_secundario?.nombre || null,
      orientacion_sexual: profile.orientacion_sexual?.nombre || null,
      que_busco: profile.que_busco?.nombre || null,
      pais: profile.ubicacion?.pais || null,
      provincia: profile.ubicacion?.provincia || null,
      ciudad: profile.ubicacion?.ciudad || null,
      localidad: profile.ubicacion?.localidad || null,
      latitud: profile.ubicacion?.latitud || null,
      longitud: profile.ubicacion?.longitud || null,
      escuela_coaching: profile.escuela_coaching?.nombre || null,
      estilo_vida: profile.estilo_vida ? {
        hijos: profile.estilo_vida.hijos?.nombre,
        frecuencia_alcohol: profile.estilo_vida.frecuencia_alcohol?.nombre,
        frecuencia_fumar: profile.estilo_vida.frecuencia_fumar?.nombre,
        ejercicio: profile.estilo_vida.ejercicio?.nombre,
        redes_sociales: profile.estilo_vida.redes_sociales?.nombre,
        habitos_sueno: profile.estilo_vida.habitos_sueno?.nombre,
        signo_zodiacal: profile.estilo_vida.signo_zodiacal?.nombre,
        mascotas: profile.estilo_vida.mascotas?.nombre,
        habitos_alimentacion: profile.estilo_vida.habitos_alimentacion?.nombre,
      } : null,
      intereses: profile.intereses?.map((i: any) => i.nombre) || [],
      photos: [], // Las fotos se obtendrían de otra tabla
      empresa: profile.info_profesional?.empresa || null,
      cargo: profile.info_profesional?.cargo || null,
      titulo: profile.info_profesional?.titulo || null,
      distancia_km: null, // Se calcularía con la ubicación del usuario
      score: Math.random() * 100, // Score temporal
      score_intereses: Math.random() * 100,
      score_estilo: Math.random() * 100,
      score_proximidad: Math.random() * 100,
      score_que_busco: Math.random() * 100,
      score_actividad: Math.random() * 100,
      last_activity: profile.updated_at,
    }))

    // Validar cada perfil
    const validatedProfiles = profiles.map((profile: any) => {
      try {
        return SwipeProfileSchema.parse(profile)
      } catch (validationError) {
        console.error('Error validando perfil en fallback:', validationError, profile)
        return null
      }
    }).filter(Boolean) as any[]

    return {
      items: validatedProfiles,
      nextCursor: undefined, // Sin paginación en fallback por simplicidad
    }
  } catch (error) {
    console.error('Error en fetchFeedPageFallback:', error)
    throw error
  }
}

/**
 * Registra una interacción (like/dislike) en la base de datos
 */
export async function recordInteraction(
  fromUserId: string,
  toUserId: string,
  interactionType: 'like' | 'dislike'
): Promise<void> {
  try {
    const supabase = createSupabaseServerClient()
    
    const { error } = await supabase
      .from('user_interactions')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        interaction_type: interactionType,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error registrando interacción:', error)
      throw new Error(`Error al registrar interacción: ${error.message}`)
    }
  } catch (error) {
    console.error('Error en recordInteraction:', error)
    throw error
  }
}

/**
 * Actualiza la actividad del usuario (opcional, para bump de actividad)
 */
export async function bumpUserActivity(userId: string): Promise<void> {
  try {
    const supabase = createSupabaseServerClient()
    
    const { error } = await supabase.rpc('bump_activity_pair', {
      a: userId,
      b: userId, // Auto-actualización
    })

    if (error) {
      console.error('Error actualizando actividad:', error)
      // No lanzar error aquí ya que es opcional
    }
  } catch (error) {
    console.error('Error en bumpUserActivity:', error)
    // No lanzar error aquí ya que es opcional
  }
}
