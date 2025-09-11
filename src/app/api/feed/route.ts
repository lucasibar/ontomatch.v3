import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client-server'
import { fetchFeedPage } from '@/core/feed/repo'
import { FeedParams } from '@/core/feed/types'

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la query
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const after_score = searchParams.get('after_score')
    const after_user = searchParams.get('after_user')

    // Validar parámetros
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { message: 'El límite debe estar entre 1 y 50' },
        { status: 400 }
      )
    }

    // Obtener el usuario autenticado desde la sesión
    const supabase = createSupabaseServerClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const viewerId = session.user.id

    // Preparar parámetros para el repo
    const params: FeedParams = {
      viewerId,
      limit,
      ...(after_score && { after_score: parseFloat(after_score) }),
      ...(after_user && { after_user }),
    }

    // Obtener el feed
    const feedPage = await fetchFeedPage(params)

    // Responder con los datos
    return NextResponse.json({
      items: feedPage.items,
      nextCursor: feedPage.nextCursor,
    })

  } catch (error) {
    console.error('Error en /api/feed:', error)
    
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    
    return NextResponse.json(
      { message },
      { status: 502 }
    )
  }
}
