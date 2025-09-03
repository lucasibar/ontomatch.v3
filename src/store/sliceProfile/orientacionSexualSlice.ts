import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para las opciones de orientación sexual
export interface OpcionOrientacionSexual {
  id: string
  nombre: string
  habilitada: boolean
  orden: number
  created_at: string | null
}

export interface OrientacionSexualState {
  // Opciones disponibles
  opcionesOrientacionSexual: OpcionOrientacionSexual[]
  loading: boolean
  error: string | null
}

const initialState: OrientacionSexualState = {
  opcionesOrientacionSexual: [],
  loading: false,
  error: null,
}

// Thunk para cargar las opciones de orientación sexual
export const fetchOpcionesOrientacionSexual = createAsyncThunk(
  'orientacionSexual/fetchOpcionesOrientacionSexual',
  async () => {
    const { data, error } = await supabase
      .from('opciones_orientacion_sexual')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

const orientacionSexualSlice = createSlice({
  name: 'orientacionSexual',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearOrientacionSexual: (state) => {
      state.opcionesOrientacionSexual = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Opciones Orientación Sexual
    builder
      .addCase(fetchOpcionesOrientacionSexual.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOpcionesOrientacionSexual.fulfilled, (state, action) => {
        state.opcionesOrientacionSexual = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(fetchOpcionesOrientacionSexual.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar opciones de orientación sexual'
      })
  },
})

export const { 
  clearError, 
  clearOrientacionSexual
} = orientacionSexualSlice.actions

export default orientacionSexualSlice.reducer
