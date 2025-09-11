import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client-server'
import { recordInteraction, bumpUserActivity } from '@/core/feed/repo'

export async function POST(request: NextRequest) {
  try {
    // Obtener el usuario autenticado desde la sesión
    const supabase = createSupabaseServerClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const fromUserId = session.user.id

    // Parsear el body de la request
    const body = await request.json()
    const { toUserId, interactionType } = body

    // Validar parámetros
    if (!toUserId || !interactionType) {
      return NextResponse.json(
        { message: 'Faltan parámetros requeridos: toUserId, interactionType' },
        { status: 400 }
      )
    }

    if (!['like', 'dislike'].includes(interactionType)) {
      return NextResponse.json(
        { message: 'interactionType debe ser "like" o "dislike"' },
        { status: 400 }
      )
    }

    if (fromUserId === toUserId) {
      return NextResponse.json(
        { message: 'No puedes interactuar contigo mismo' },
        { status: 400 }
      )
    }

    // Registrar la interacción
    await recordInteraction(fromUserId, toUserId, interactionType as 'like' | 'dislike')

    // Actualizar actividad del usuario (opcional, no bloqueante)
    bumpUserActivity(fromUserId).catch(error => {
      console.error('Error actualizando actividad:', error)
    })

    return NextResponse.json({
      success: true,
      message: 'Interacción registrada correctamente',
    })

  } catch (error) {
    console.error('Error en /api/interactions:', error)
    
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    
    return NextResponse.json(
      { message },
      { status: 500 }
    )
  }
}
