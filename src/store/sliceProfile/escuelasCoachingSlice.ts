import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para las escuelas de coaching
export interface EscuelaCoaching {
  id: string
  nombre: string
  habilitada: boolean
  created_at: string | null
}

export interface EscuelasCoachingState {
  // Todas las escuelas disponibles
  escuelas: EscuelaCoaching[]
  // Escuela seleccionada
  escuelaSeleccionada: EscuelaCoaching | null
  loading: boolean
  error: string | null
}

const initialState: EscuelasCoachingState = {
  escuelas: [],
  escuelaSeleccionada: null,
  loading: false,
  error: null,
}

// Thunk para cargar todas las escuelas de coaching
export const fetchEscuelasCoaching = createAsyncThunk(
  'escuelasCoaching/fetchEscuelasCoaching',
  async () => {
    const { data, error } = await supabase
      .from('escuelas_coaching')
      .select('*')
      .eq('habilitada', true)
      .order('nombre')

    if (error) throw error
    return data || []
  }
)

// Thunk para crear una nueva escuela
export const crearEscuelaCoaching = createAsyncThunk(
  'escuelasCoaching/crearEscuelaCoaching',
  async (nombre: string) => {
    const { data, error } = await supabase
      .from('escuelas_coaching')
      .insert({
        nombre,
        habilitada: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
)

const escuelasCoachingSlice = createSlice({
  name: 'escuelasCoaching',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setEscuelaSeleccionada: (state, action: PayloadAction<EscuelaCoaching | null>) => {
      state.escuelaSeleccionada = action.payload
    },
    clearEscuelasCoaching: (state) => {
      state.escuelas = []
      state.escuelaSeleccionada = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Escuelas Coaching
    builder
      .addCase(fetchEscuelasCoaching.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEscuelasCoaching.fulfilled, (state, action) => {
        state.escuelas = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(fetchEscuelasCoaching.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar escuelas de coaching'
      })

    // Crear Escuela Coaching
    builder
      .addCase(crearEscuelaCoaching.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(crearEscuelaCoaching.fulfilled, (state, action) => {
        state.escuelas.push(action.payload)
        state.escuelaSeleccionada = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(crearEscuelaCoaching.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al crear escuela de coaching'
      })
  },
})

export const { 
  clearError, 
  setEscuelaSeleccionada,
  clearEscuelasCoaching
} = escuelasCoachingSlice.actions

export default escuelasCoachingSlice.reducer
