import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para información profesional
export interface InfoProfesionalFormData {
  empresa: string
  cargo: string
  titulo: string
}

export interface InfoProfesionalState {
  formData: InfoProfesionalFormData
  loading: boolean
  error: string | null
}

const initialState: InfoProfesionalState = {
  formData: {
    empresa: '',
    cargo: '',
    titulo: ''
  },
  loading: false,
  error: null,
}

// Thunk para actualizar información profesional
export const updateInfoProfesional = createAsyncThunk(
  'infoProfesional/updateInfoProfesional',
  async (infoProfesionalData: InfoProfesionalFormData & { profileId: string }) => {
    const { data, error } = await supabase
      .from('info_profesional')
      .upsert({
        id: infoProfesionalData.profileId, // Usar el profileId como id
        empresa: infoProfesionalData.empresa || null,
        cargo: infoProfesionalData.cargo || null,
        titulo: infoProfesionalData.titulo || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
)

const infoProfesionalSlice = createSlice({
  name: 'infoProfesional',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateFormData: (state, action: PayloadAction<Partial<InfoProfesionalFormData>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetFormData: (state) => {
      state.formData = initialState.formData
    },
    clearInfoProfesional: (state) => {
      state.formData = initialState.formData
      state.error = null
    }
  },
  extraReducers: (builder) => {
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
        state.error = action.error.message || 'Error al actualizar información profesional'
      })
  },
})

export const { 
  clearError, 
  updateFormData, 
  resetFormData, 
  clearInfoProfesional 
} = infoProfesionalSlice.actions

export default infoProfesionalSlice.reducer
