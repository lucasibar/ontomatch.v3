import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/shared/types/profile'
import type { ProfileUpdateInput } from '@/shared/types/profile-update'

export interface ProfileState {
  profile: Profile
  loading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profile: {
    id: '',
    nombre_completo: '',
    email: '',
    descripcion: null,
    edad: null,
    altura: null,
    genero_primario_id: null,
    genero_secundario_id: null,
    que_busco_id: null,
    ubicacion_id: null,
    escuela_coaching_id: null,
    estilo_vida_id: {
      hijos_id: '',
      frecuencia_alcohol_id: '',
      frecuencia_fumar_id: '',
      ejercicio_id: '',
      redes_sociales_id: '',
      habitos_sueno_id: '',
      signo_zodiacal_id: '',
      mascotas_id: '',
      habitos_alimentacion_id: ''
    },
    info_profesional: {
      empresa: '',
      cargo: ''
    },
    orientacion_sexual_id: null,
    edad_min: null,
    edad_max: null,
    distancia_maxima: null,
    info_basica_cargada: false,
    intereses_ids: [],
    created_at: null,
    updated_at: null
  },
  loading: false,
  error: null,
}

// Cargar perfil completo
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    // 1) Perfil base
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    // 2) Intereses → sólo IDs
    const { data: interesesRows } = await supabase
      .from('profile_intereses')
      .select('interes_id')
      .eq('profile_id', userId)

    const interesesIds = (interesesRows || []).map(r => r.interes_id)

    // 3) Estilo de vida → expandido si hay id
    let estiloVidaExpanded:
      | {
          hijos_id: string
          frecuencia_alcohol_id: string
          frecuencia_fumar_id: string
          ejercicio_id: string
          redes_sociales_id: string
          habitos_sueno_id: string
          signo_zodiacal_id: string
          mascotas_id: string
          habitos_alimentacion_id: string
        }
      | null = null

    if (profileData.estilo_vida_id) {
      const { data: estiloVida } = await supabase
        .from('estilos_vida')
        .select(
          'hijos_id,frecuencia_alcohol_id,frecuencia_fumar_id,ejercicio_id,redes_sociales_id,habitos_sueno_id,signo_zodiacal_id,mascotas_id,habitos_alimentacion_id'
        )
        .eq('id', profileData.estilo_vida_id)
        .maybeSingle()

      if (estiloVida) {
        estiloVidaExpanded = {
          hijos_id: estiloVida.hijos_id || '',
          frecuencia_alcohol_id: estiloVida.frecuencia_alcohol_id || '',
          frecuencia_fumar_id: estiloVida.frecuencia_fumar_id || '',
          ejercicio_id: estiloVida.ejercicio_id || '',
          redes_sociales_id: estiloVida.redes_sociales_id || '',
          habitos_sueno_id: estiloVida.habitos_sueno_id || '',
          signo_zodiacal_id: estiloVida.signo_zodiacal_id || '',
          mascotas_id: estiloVida.mascotas_id || '',
          habitos_alimentacion_id: estiloVida.habitos_alimentacion_id || ''
        }
      }
    }

    // 4) Info profesional → opcional (maybeSingle)
    let infoProfesionalExpanded:
      | {
          empresa: string
          cargo: string
        }
      | null = null

    const { data: infoProfesional } = await supabase
      .from('info_profesional')
      .select('empresa,cargo,user_id')
      .eq('user_id', profileData.id)
      .maybeSingle()

    if (infoProfesional) {
      infoProfesionalExpanded = {
        empresa: infoProfesional.empresa || '',
        cargo: infoProfesional.cargo || ''
      }
    }

    return {
      ...profileData,
      intereses_ids: interesesIds,
      estilo_vida_id:
        estiloVidaExpanded ?? {
          hijos_id: '',
          frecuencia_alcohol_id: '',
          frecuencia_fumar_id: '',
          ejercicio_id: '',
          redes_sociales_id: '',
          habitos_sueno_id: '',
          signo_zodiacal_id: '',
          mascotas_id: '',
          habitos_alimentacion_id: ''
        },
      info_profesional:
        infoProfesionalExpanded ?? {
          empresa: '',
          cargo: ''
        }
    } as Profile
  }
)

// Actualizar perfil (sólo tabla profiles)
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (payload: ProfileUpdateInput) => {
    const { id, ...updateFields } = payload

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProfile: (state) => {
      state.profile = initialState.profile
      state.error = null
    },
    updateProfileLocal: (state, action: PayloadAction<Partial<Profile>>) => {
      state.profile = { ...state.profile, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar el perfil'
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al actualizar el perfil'
      })
  },
})

export const { clearError, clearProfile, updateProfileLocal } = profileSlice.actions
export default profileSlice.reducer
