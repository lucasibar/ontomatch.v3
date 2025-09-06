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
  // Intereses seleccionados por el usuario
  interesesSeleccionados: string[]
  // Estado de carga
  loading: boolean
  error: string | null
}

const initialState: InteresState = {
  intereses: [],
  categorias: [],
  interesesSeleccionados: [],
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
export const fetchInteresesUsuario = createAsyncThunk(
  'intereses/fetchInteresesUsuario',
  async (profileId: string) => {
    const { data, error } = await supabase
      .from('profile_intereses')
      .select('interes_id')
      .eq('profile_id', profileId)

    if (error) throw error
    return data?.map(item => item.interes_id) || []
  }
)

// Thunk para guardar los intereses del usuario
export const guardarInteresesUsuario = createAsyncThunk(
  'intereses/guardarInteresesUsuario',
  async ({ profileId, interesesIds }: { profileId: string; interesesIds: string[] }) => {
    console.log('🔍 guardarInteresesUsuario - profileId:', profileId, 'interesesIds:', interesesIds)
    
    // Verificar la sesión actual
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔍 Sesión actual:', session?.user?.id)
    
    // Primero eliminar todos los intereses existentes del usuario
    console.log('🗑️ Eliminando intereses existentes...')
    const { error: deleteError } = await supabase
      .from('profile_intereses')
      .delete()
      .eq('profile_id', profileId)

    if (deleteError) {
      console.error('❌ Error eliminando intereses:', deleteError)
      throw deleteError
    }
    console.log('✅ Intereses eliminados correctamente')

    // Si no hay intereses para guardar, terminar aquí
    if (interesesIds.length === 0) {
      console.log('⚠️ No hay intereses para guardar')
      return []
    }

    // Insertar los nuevos intereses seleccionados
    const interesesParaInsertar = interesesIds.map(interesId => ({
      profile_id: profileId,
      interes_id: interesId
    }))

    console.log('➕ Insertando nuevos intereses:', interesesParaInsertar)
    const { data, error } = await supabase
      .from('profile_intereses')
      .insert(interesesParaInsertar)
      .select('interes_id')

    if (error) {
      console.error('❌ Error insertando intereses:', error)
      throw error
    }
    
    console.log('✅ Intereses insertados correctamente:', data)
    return data?.map(item => item.interes_id) || []
  }
)

const interesesSlice = createSlice({
  name: 'intereses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    toggleInteres: (state, action: PayloadAction<string>) => {
      const interesId = action.payload
      const index = state.interesesSeleccionados.indexOf(interesId)
      
      if (index > -1) {
        // Si ya está seleccionado, lo quitamos
        state.interesesSeleccionados.splice(index, 1)
      } else {
        // Si no está seleccionado y no hemos llegado al límite, lo agregamos
        if (state.interesesSeleccionados.length < 10) {
          state.interesesSeleccionados.push(interesId)
        }
      }
    },
    setInteresesSeleccionados: (state, action: PayloadAction<string[]>) => {
      state.interesesSeleccionados = action.payload
    },
    clearIntereses: (state) => {
      state.intereses = []
      state.categorias = []
      state.interesesSeleccionados = []
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

    // Fetch Intereses Usuario
    builder
      .addCase(fetchInteresesUsuario.fulfilled, (state, action) => {
        state.interesesSeleccionados = action.payload
        state.error = null
      })
      .addCase(fetchInteresesUsuario.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar intereses del usuario'
      })

    // Guardar Intereses Usuario
    builder
      .addCase(guardarInteresesUsuario.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(guardarInteresesUsuario.fulfilled, (state, action) => {
        state.interesesSeleccionados = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(guardarInteresesUsuario.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al guardar intereses'
      })
  },
})

export const { 
  clearError, 
  toggleInteres, 
  setInteresesSeleccionados, 
  clearIntereses 
} = interesesSlice.actions

export default interesesSlice.reducer
