import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

export interface InfoProfesional {
  id: string
  empresa: string
  cargo: string
  profile_id: string
  created_at: string | null
  updated_at: string | null
}

export interface InfoProfesionalState {
  formData: {
    empresa: string
    cargo: string
  }
  loading: boolean
  error: string | null
}

const initialState: InfoProfesionalState = {
  formData: {
    empresa: '',
    cargo: ''
  },
  loading: false,
  error: null
}

// Thunk para cargar la información profesional del usuario
export const fetchInfoProfesionalUsuario = createAsyncThunk(
  'infoProfesional/fetchInfoProfesionalUsuario',
  async (userId: string) => {
    try {
      // Buscar la información profesional directamente por user_id
      const { data, error } = await supabase
        .from('info_profesional')
        .select('empresa, cargo')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error al cargar información profesional:', error)
        return { empresa: '', cargo: '' }
      }

      return {
        empresa: data?.empresa || '',
        cargo: data?.cargo || ''
      }
    } catch (error) {
      console.error('Error inesperado al cargar información profesional:', error)
      return { empresa: '', cargo: '' }
    }
  }
)

// Thunk para guardar la información profesional
export const updateInfoProfesional = createAsyncThunk(
  'infoProfesional/updateInfoProfesional',
  async ({ profileId, empresa, cargo }: { profileId: string; empresa: string; cargo: string }) => {
    try {
      // Buscar si ya existe un registro
      // Verificar si ya existe un registro para este usuario
      const { data: existing, error: checkError } = await supabase
        .from('info_profesional')
        .select('id')
        .eq('user_id', profileId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 es "no rows returned", que es esperado si no existe
        console.error('Error al verificar información profesional existente:', checkError)
        throw checkError
      }

      if (existing) {
        // Si ya existe, actualizar
        const { data, error } = await supabase
          .from('info_profesional')
          .update({
            empresa,
            cargo
          })
          .eq('user_id', profileId)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Si no existe, crear nuevo
        const { data, error } = await supabase
          .from('info_profesional')
          .insert({
            user_id: profileId,
            empresa,
            cargo
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error al guardar información profesional:', error)
      throw error
    }
  }
)

const infoProfesionalSlice = createSlice({
  name: 'infoProfesional',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<{ empresa?: string; cargo?: string }>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
    clearFormData: (state) => {
      state.formData = { empresa: '', cargo: '' }
    }
  },
  extraReducers: (builder) => {
    // Fetch Info Profesional Usuario
    builder
      .addCase(fetchInfoProfesionalUsuario.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInfoProfesionalUsuario.fulfilled, (state, action) => {
        state.formData = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(fetchInfoProfesionalUsuario.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar información profesional'
      })

    // Update Info Profesional
    builder
      .addCase(updateInfoProfesional.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInfoProfesional.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(updateInfoProfesional.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al guardar información profesional'
      })
  }
})

export const { updateFormData, clearError, clearFormData } = infoProfesionalSlice.actions
export default infoProfesionalSlice.reducer