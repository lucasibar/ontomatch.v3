import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { Ubicacion } from '@/shared/types/profile'

export interface UbicacionState {
  ubicaciones: Ubicacion[]
  loading: boolean
  error: string | null
}

const initialState: UbicacionState = {
  ubicaciones: [],
  loading: false,
  error: null,
}

// Thunk para cargar TODAS las ubicaciones
export const fetchUbicaciones = createAsyncThunk(
  'ubicacion/fetchUbicaciones',
  async () => {
    const { data, error } = await supabase
      .from('ubicaciones')
      .select('*')
      .order('provincia')
      .order('ciudad')
      .order('localidad')

    if (error) {
      console.error('❌ Error cargando ubicaciones:', error)
      throw error
    }
    
    return data
  }
)

const ubicacionSlice = createSlice({
  name: 'ubicacion',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearUbicaciones: (state) => {
      state.ubicaciones = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Ubicaciones
    builder
      .addCase(fetchUbicaciones.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUbicaciones.fulfilled, (state, action) => {
        state.loading = false
        state.ubicaciones = action.payload
        state.error = null
      })
      .addCase(fetchUbicaciones.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar ubicaciones'
      })
  },
})

export const { clearError, clearUbicaciones } = ubicacionSlice.actions
export default ubicacionSlice.reducer
