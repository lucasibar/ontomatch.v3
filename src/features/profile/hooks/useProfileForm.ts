'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { supabase } from '@/lib/supabase'

// perfil
import { fetchProfile, updateProfile, updateProfileLocal } from '@/store/sliceProfile/profileSlice'
import type { Profile } from '@/shared/types/profile'

// TUS thunks de opciones (como los tenías antes)
import {
  fetchGenerosPrimarios,
  fetchGenerosSecundarios,
  fetchUbicaciones,
  fetchEscuelasCoaching,
  fetchIntereses,
  fetchCategoriasIntereses,
  fetchOpcionesOrientacionSexual,
  fetchOpcionesQueBusco,
  fetchOpcionesHijos,
  fetchOpcionesFrecuenciaAlcohol,
  fetchOpcionesFrecuenciaFumar,
  fetchOpcionesEjercicio,
  fetchOpcionesRedesSociales,
  fetchOpcionesHabitosSueno,
  fetchOpcionesSignosZodiacales,
  fetchOpcionesMascotas,
  fetchOpcionesHabitosAlimentacion,
  clearProfileError,
} from '@/store/sliceProfile' // <- mismo barrel que usabas antes

export function useProfileForm() {
  const dispatch = useAppDispatch()
  const { profile, loading: loadingProfile, error } = useAppSelector((s) => s.profile)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // cargar auth + todo lo necesario (perfil + opciones)
  useEffect(() => {
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth.user?.id
      if (!userId) {
        setSubmitError('No hay usuario autenticado')
        return
      }

      // mantener id en store para formularios controlados
      dispatch(updateProfileLocal({ id: userId }))

      if (!dataLoaded) {
        // perfil completo
        await dispatch(fetchProfile(userId))

        // OPCIONES (como lo tenías)
        dispatch(fetchGenerosPrimarios())
        dispatch(fetchGenerosSecundarios())
        dispatch(fetchOpcionesOrientacionSexual())
        dispatch(fetchUbicaciones())
        dispatch(fetchOpcionesQueBusco())
        dispatch(fetchOpcionesHijos())
        dispatch(fetchOpcionesFrecuenciaAlcohol())
        dispatch(fetchOpcionesFrecuenciaFumar())
        dispatch(fetchOpcionesEjercicio())
        dispatch(fetchOpcionesRedesSociales())
        dispatch(fetchOpcionesHabitosSueno())
        dispatch(fetchOpcionesSignosZodiacales())
        dispatch(fetchOpcionesMascotas())
        dispatch(fetchOpcionesHabitosAlimentacion())
        dispatch(fetchIntereses())
        dispatch(fetchCategoriasIntereses())

        setDataLoaded(true)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded])

  // --- helpers de sincronización ---

  const syncIntereses = useCallback(async (userId: string, interesesSeleccionados: string[]) => {
    const { data: actuales, error: readErr } = await supabase
      .from('profile_intereses')
      .select('interes_id')
      .eq('profile_id', userId)

    if (readErr) throw readErr

    const existingIds = (actuales || []).map((r) => String(r.interes_id))
    const desiredIds = (interesesSeleccionados || []).filter((id, i, arr) => arr.indexOf(id) === i)

    const toInsert = desiredIds
      .filter((id) => !existingIds.includes(id))
      .map((id) => ({ profile_id: userId, interes_id: id }))

    const toDelete = existingIds.filter((id) => !desiredIds.includes(id))

    if (toInsert.length > 0) {
      const { error: insErr } = await supabase.from('profile_intereses').insert(toInsert)
      if (insErr) throw insErr
    }

    if (toDelete.length > 0) {
      const { error: delErr } = await supabase
        .from('profile_intereses')
        .delete()
        .eq('profile_id', userId)
        .in('interes_id', toDelete)
      if (delErr) throw delErr
    }
  }, [])

  const upsertInfoProfesional = useCallback(
    async (userId: string, data: { empresa?: string; cargo?: string }) => {
      const { data: row, error: selErr } = await supabase
        .from('info_profesional')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (selErr) throw selErr

      if (!row) {
        const { error: insErr } = await supabase
          .from('info_profesional')
          .insert({ user_id: userId, empresa: data.empresa ?? '', cargo: data.cargo ?? '' })
        if (insErr) throw insErr
      } else {
        const { error: updErr } = await supabase
          .from('info_profesional')
          .update({ empresa: data.empresa ?? '', cargo: data.cargo ?? '' })
          .eq('id', row.id)
        if (updErr) throw updErr
      }
    },
    []
  )

  const upsertEstiloVida = useCallback(
    async (userId: string, estiloVida: NonNullable<Profile['estilo_vida_id']>) => {
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('estilo_vida_id')
        .eq('id', userId)
        .single()
      if (profErr) throw profErr

      const payload = {
        hijos_id: estiloVida.hijos_id || null,
        frecuencia_alcohol_id: estiloVida.frecuencia_alcohol_id || null,
        frecuencia_fumar_id: estiloVida.frecuencia_fumar_id || null,
        ejercicio_id: estiloVida.ejercicio_id || null,
        redes_sociales_id: estiloVida.redes_sociales_id || null,
        habitos_sueno_id: estiloVida.habitos_sueno_id || null,
        signo_zodiacal_id: estiloVida.signo_zodiacal_id || null,
        mascotas_id: estiloVida.mascotas_id || null,
        habitos_alimentacion_id: estiloVida.habitos_alimentacion_id || null
      }

      if (prof.estilo_vida_id) {
        const { error: updErr } = await supabase
          .from('estilos_vida')
          .update(payload)
          .eq('id', prof.estilo_vida_id)
        if (updErr) throw updErr
      } else {
        const { data: inserted, error: insErr } = await supabase
          .from('estilos_vida')
          .insert(payload)
          .select('id')
          .single()
        if (insErr) throw insErr

        const { error: updProfErr } = await supabase
          .from('profiles')
          .update({ estilo_vida_id: inserted.id })
          .eq('id', userId)
        if (updProfErr) throw updProfErr
      }
    },
    []
  )

  // submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault()
      setSubmitting(true)
      setSubmitError(null)

      try {
        const userId = profile.id
        if (!userId) throw new Error('Usuario no identificado')

        // 1) update de profiles (campos directos)
        await dispatch(
          updateProfile({
            id: userId,
            nombre_completo: profile.nombre_completo,
            descripcion: profile.descripcion ?? null,
            edad: profile.edad ?? null,
            altura: profile.altura ?? null,
            genero_primario_id: profile.genero_primario_id ?? null,
            genero_secundario_id: profile.genero_secundario_id ?? null,
            ubicacion_id: profile.ubicacion_id ?? null,
            que_busco_id: profile.que_busco_id ?? null,
            orientacion_sexual_id: profile.orientacion_sexual_id ?? null,
            edad_min: profile.edad_min ?? null,
            edad_max: profile.edad_max ?? null,
            distancia_maxima: profile.distancia_maxima ?? null,
            escuela_coaching_id: profile.escuela_coaching_id ?? null,
            info_basica_cargada: true
          })
        ).unwrap()

        // 2) info profesional
        await upsertInfoProfesional(userId, {
          empresa: profile.info_profesional?.empresa ?? '',
          cargo: profile.info_profesional?.cargo ?? ''
        })

        // 3) estilo de vida
        await upsertEstiloVida(userId, {
          hijos_id: profile.estilo_vida_id?.hijos_id ?? '',
          frecuencia_alcohol_id: profile.estilo_vida_id?.frecuencia_alcohol_id ?? '',
          frecuencia_fumar_id: profile.estilo_vida_id?.frecuencia_fumar_id ?? '',
          ejercicio_id: profile.estilo_vida_id?.ejercicio_id ?? '',
          redes_sociales_id: profile.estilo_vida_id?.redes_sociales_id ?? '',
          habitos_sueno_id: profile.estilo_vida_id?.habitos_sueno_id ?? '',
          signo_zodiacal_id: profile.estilo_vida_id?.signo_zodiacal_id ?? '',
          mascotas_id: profile.estilo_vida_id?.mascotas_id ?? '',
          habitos_alimentacion_id: profile.estilo_vida_id?.habitos_alimentacion_id ?? ''
        })

        // 4) intereses
        await syncIntereses(userId, profile.intereses_ids || [])

        // 5) refrescar
        await dispatch(fetchProfile(userId))
      } catch (err: any) {
        console.error('Error al guardar perfil:', err)
        setSubmitError(err?.message ?? 'Error al guardar el perfil')
      } finally {
        setSubmitting(false)
      }
    },
    [dispatch, profile, syncIntereses, upsertInfoProfesional, upsertEstiloVida]
  )

  const loading = useMemo(() => loadingProfile || submitting, [loadingProfile, submitting])

  return {
    profile,
    loading,
    error: submitError ?? error,
    handleSubmit,
    clearError: () => dispatch(clearProfileError()),
  }
}
