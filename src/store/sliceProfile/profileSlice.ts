import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { Profile, ProfileFormData } from '@/shared/types/profile'

export interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
}

// Thunk para cargar el perfil del usuario
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }
)

// Thunk para actualizar el perfil
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: ProfileFormData & { id: string; info_basica_cargada: boolean }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        nombre_completo: profileData.nombre_completo,
        descripcion: profileData.descripcion,
        edad: profileData.edad,
        genero_primario_id: profileData.genero_primario_id,
        genero_secundario_id: profileData.genero_secundario_id || null,
        ubicacion_id: profileData.ubicacion_id,
        que_busco_id: profileData.que_busco_id || null,
        orientacion_sexual_id: profileData.orientacion_sexual_id || null,
        edad_min: profileData.edad_min || null,
        edad_max: profileData.edad_max || null,
        distancia_maxima: profileData.distancia_maxima || null,
        escuela_coaching_id: profileData.escuela_coaching_id || null,
        info_basica_cargada: profileData.info_basica_cargada,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileData.id)
      .select()
      .single()

    if (error) throw error
    return data
  }
)

// Thunk para manejar escuela de coaching (crear si no existe, obtener ID si existe)
export const handleEscuelaCoaching = createAsyncThunk(
  'profile/handleEscuelaCoaching',
  async ({ profileId, escuelaNombre }: { profileId: string; escuelaNombre: string }) => {
    if (!escuelaNombre.trim()) return null

    // Primero buscar si ya existe
    const { data: existingEscuela, error: searchError } = await supabase
      .from('escuelas_coaching')
      .select('id')
      .eq('nombre', escuelaNombre.trim())
      .single()

    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError
    }

    let escuelaId = existingEscuela?.id

    // Si no existe, crear nueva
    if (!escuelaId) {
      const { data: newEscuela, error: createError } = await supabase
        .from('escuelas_coaching')
        .insert({
          nombre: escuelaNombre.trim(),
          habilitada: true
        })
        .select('id')
        .single()

      if (createError) throw createError
      escuelaId = newEscuela.id
    }

    // Actualizar el perfil con el ID de la escuela
    const { data, error } = await supabase
      .from('profiles')
      .update({
        escuela_coaching_id: escuelaId,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileId)
      .select()
      .single()

    if (error) throw error
    return data
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
      state.profile = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Profile
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

    // Update Profile
    builder
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

    // Handle Escuela Coaching
    builder
      .addCase(handleEscuelaCoaching.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(handleEscuelaCoaching.fulfilled, (state, action) => {
        if (action.payload) {
          state.profile = action.payload
        }
        state.loading = false
        state.error = null
      })
      .addCase(handleEscuelaCoaching.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al manejar escuela de coaching'
      })
  },
})

export const { clearError, clearProfile } = profileSlice.actions
export default profileSlice.reducer
