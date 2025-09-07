import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para los intereses
export interface Interes {
  id: string
  nombre: string
  categoria_nombre: string
  habilitada: boolean
  orden: number
  created_at: string | null
}

export interface CategoriaInteres {
  categoria_nombre: string
  total_intereses: number
}

export interface InteresState {
  // Todos los intereses disponibles
  intereses: Interes[]
  // Categorías disponibles
  categorias: CategoriaInteres[]
  // Estado de carga
  loading: boolean
  error: string | null
}

const initialState: InteresState = {
  intereses: [],
  categorias: [],
  loading: false,
  error: null,
}

// Thunk para cargar todos los intereses
export const fetchIntereses = createAsyncThunk(
  'intereses/fetchIntereses',
  async () => {
    const { data, error } = await supabase
      .from('intereses')
      .select('*')
      .eq('habilitada', true)
      .order('categoria_nombre')
      .order('orden')

    if (error) throw error
    return data || []
  }
)

// Thunk para cargar las categorías
export const fetchCategoriasIntereses = createAsyncThunk(
  'intereses/fetchCategoriasIntereses',
  async () => {
    const { data, error } = await supabase
      .from('intereses')
      .select('categoria_nombre')
      .eq('habilitada', true)
      .order('categoria_nombre')

    if (error) throw error
    
    // Agrupar por categoría y contar
    const categoriasMap = new Map<string, number>()
    data?.forEach(interes => {
      const categoria = interes.categoria_nombre
      categoriasMap.set(categoria, (categoriasMap.get(categoria) || 0) + 1)
    })
    
    const categorias = Array.from(categoriasMap.entries()).map(([categoria_nombre, total_intereses]) => ({
      categoria_nombre,
      total_intereses
    }))
    
    return categorias
  }
)

// Thunk para cargar los intereses seleccionados del usuario

const interesesSlice = createSlice({
  name: 'intereses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearIntereses: (state) => {
      state.intereses = []
      state.categorias = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Intereses
    builder
      .addCase(fetchIntereses.fulfilled, (state, action) => {
        state.intereses = action.payload
        state.error = null
      })
      .addCase(fetchIntereses.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar intereses'
      })

    // Fetch Categorías
    builder
      .addCase(fetchCategoriasIntereses.fulfilled, (state, action) => {
        state.categorias = action.payload
        state.error = null
      })
      .addCase(fetchCategoriasIntereses.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar categorías'
      })

  },
})

export const { 
  clearError, 
  clearIntereses 
} = interesesSlice.actions

export default interesesSlice.reducer
