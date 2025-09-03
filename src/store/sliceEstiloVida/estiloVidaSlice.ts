import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para estilo de vida
export interface Hobby {
  id: string
  nombre: string
  categoria: string
}

export interface Interes {
  id: string
  nombre: string
  categoria: string
}

export interface EstiloVidaFormData {
  hobbies: string[]
  intereses: string[]
  nivel_actividad: string
  tipo_musica: string[]
  deportes: string[]
  comida_preferida: string[]
}

export interface EstiloVidaState {
  hobbies: Hobby[]
  intereses: Interes[]
  formData: EstiloVidaFormData
  loading: boolean
  error: string | null
}

const initialState: EstiloVidaState = {
  hobbies: [],
  intereses: [],
  formData: {
    hobbies: [],
    intereses: [],
    nivel_actividad: '',
    tipo_musica: [],
    deportes: [],
    comida_preferida: []
  },
  loading: false,
  error: null,
}

// Thunk para cargar hobbies
export const fetchHobbies = createAsyncThunk(
  'estiloVida/fetchHobbies',
  async () => {
    const { data, error } = await supabase
      .from('hobbies')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('❌ Error cargando hobbies:', error)
      throw error
    }
    
    return data || []
  }
)

// Thunk para cargar intereses
export const fetchIntereses = createAsyncThunk(
  'estiloVida/fetchIntereses',
  async () => {
    const { data, error } = await supabase
      .from('intereses')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('❌ Error cargando intereses:', error)
      throw error
    }
    
    return data || []
  }
)

// Thunk para actualizar estilo de vida
export const updateEstiloVida = createAsyncThunk(
  'estiloVida/updateEstiloVida',
  async (estiloVidaData: EstiloVidaFormData & { profileId: string }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        hobbies: estiloVidaData.hobbies,
        intereses: estiloVidaData.intereses,
        nivel_actividad: estiloVidaData.nivel_actividad,
        tipo_musica: estiloVidaData.tipo_musica,
        deportes: estiloVidaData.deportes,
        comida_preferida: estiloVidaData.comida_preferida,
        updated_at: new Date().toISOString()
      })
      .eq('id', estiloVidaData.profileId)
      .select()
      .single()

    if (error) throw error
    return data
  }
)

const estiloVidaSlice = createSlice({
  name: 'estiloVida',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateFormData: (state, action: PayloadAction<Partial<EstiloVidaFormData>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetFormData: (state) => {
      state.formData = initialState.formData
    },
    clearEstiloVida: (state) => {
      state.hobbies = []
      state.intereses = []
      state.formData = initialState.formData
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Hobbies
    builder
      .addCase(fetchHobbies.pending, (state) => {
        state.error = null
      })
      .addCase(fetchHobbies.fulfilled, (state, action) => {
        state.hobbies = action.payload
        state.error = null
      })
      .addCase(fetchHobbies.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar hobbies'
      })

    // Fetch Intereses
    builder
      .addCase(fetchIntereses.pending, (state) => {
        state.error = null
      })
      .addCase(fetchIntereses.fulfilled, (state, action) => {
        state.intereses = action.payload
        state.error = null
      })
      .addCase(fetchIntereses.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar intereses'
      })

    // Update Estilo de Vida
    builder
      .addCase(updateEstiloVida.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEstiloVida.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(updateEstiloVida.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al actualizar estilo de vida'
      })
  },
})

export const { 
  clearError, 
  updateFormData, 
  resetFormData, 
  clearEstiloVida 
} = estiloVidaSlice.actions

export default estiloVidaSlice.reducer
