import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { GeneroPrimario, GeneroSecundario } from '@/shared/types/profile'

export interface GenerosState {
  generosPrimarios: GeneroPrimario[]
  generosSecundarios: GeneroSecundario[]
  loading: boolean
  error: string | null
}

const initialState: GenerosState = {
  generosPrimarios: [],
  generosSecundarios: [],
  loading: false,
  error: null,
}

// Thunk para cargar géneros primarios
export const fetchGenerosPrimarios = createAsyncThunk(
  'generos/fetchGenerosPrimarios',
  async () => {
    const { data, error } = await supabase
      .from('opciones_genero_primario')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('❌ Error cargando géneros primarios:', error)
      throw error
    }
    
    return data
  }
)

// Thunk para cargar TODOS los géneros secundarios
export const fetchGenerosSecundarios = createAsyncThunk(
  'generos/fetchGenerosSecundarios',
  async () => {
    const { data, error } = await supabase
      .from('opciones_genero_secundario')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('❌ Error cargando géneros secundarios:', error)
      throw error
    }
    
    return data
  }
)

const generosSlice = createSlice({
  name: 'generos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearGeneros: (state) => {
      state.generosPrimarios = []
      state.generosSecundarios = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Géneros Primarios
    builder
      .addCase(fetchGenerosPrimarios.pending, (state) => {
        state.error = null
      })
      .addCase(fetchGenerosPrimarios.fulfilled, (state, action) => {
        state.generosPrimarios = action.payload
        state.error = null
      })
      .addCase(fetchGenerosPrimarios.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar géneros primarios'
      })

    // Fetch Géneros Secundarios
    builder
      .addCase(fetchGenerosSecundarios.pending, (state) => {
        state.error = null
      })
      .addCase(fetchGenerosSecundarios.fulfilled, (state, action) => {
        state.generosSecundarios = action.payload
        state.error = null
      })
      .addCase(fetchGenerosSecundarios.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar géneros secundarios'
      })
  },
})

export const { clearError, clearGeneros } = generosSlice.actions
export default generosSlice.reducer
