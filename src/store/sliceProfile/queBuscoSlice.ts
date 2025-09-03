import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para las opciones de qué busco
export interface OpcionQueBusco {
  id: string
  nombre: string
  habilitada: boolean
  orden: number
  created_at: string | null
}

export interface QueBuscoState {
  // Opciones disponibles
  opcionesQueBusco: OpcionQueBusco[]
  loading: boolean
  error: string | null
}

const initialState: QueBuscoState = {
  opcionesQueBusco: [],
  loading: false,
  error: null,
}

// Thunk para cargar las opciones de qué busco
export const fetchOpcionesQueBusco = createAsyncThunk(
  'queBusco/fetchOpcionesQueBusco',
  async () => {
    const { data, error } = await supabase
      .from('opciones_que_busco')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

const queBuscoSlice = createSlice({
  name: 'queBusco',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearQueBusco: (state) => {
      state.opcionesQueBusco = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Opciones Que Busco
    builder
      .addCase(fetchOpcionesQueBusco.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOpcionesQueBusco.fulfilled, (state, action) => {
        state.opcionesQueBusco = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(fetchOpcionesQueBusco.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar opciones de qué busco'
      })
  },
})

export const { 
  clearError, 
  clearQueBusco
} = queBuscoSlice.actions

export default queBuscoSlice.reducer
