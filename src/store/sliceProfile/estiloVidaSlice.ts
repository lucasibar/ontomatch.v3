import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'

// Tipos para las opciones de estilo de vida
export interface OpcionEstiloVida {
  id: string
  nombre: string
  habilitada: boolean
  orden: number
  created_at: string | null
}

export interface EstiloVidaState {
  // Opciones disponibles
  opcionesHijos: OpcionEstiloVida[]
  opcionesFrecuenciaAlcohol: OpcionEstiloVida[]
  opcionesFrecuenciaFumar: OpcionEstiloVida[]
  opcionesEjercicio: OpcionEstiloVida[]
  opcionesRedesSociales: OpcionEstiloVida[]
  opcionesHabitosSueno: OpcionEstiloVida[]
  opcionesSignosZodiacales: OpcionEstiloVida[]
  opcionesMascotas: OpcionEstiloVida[]
  opcionesHabitosAlimentacion: OpcionEstiloVida[]
  loading: boolean
  error: string | null
}

const initialState: EstiloVidaState = {
  // Opciones disponibles
  opcionesHijos: [],
  opcionesFrecuenciaAlcohol: [],
  opcionesFrecuenciaFumar: [],
  opcionesEjercicio: [],
  opcionesRedesSociales: [],
  opcionesHabitosSueno: [],
  opcionesSignosZodiacales: [],
  opcionesMascotas: [],
  opcionesHabitosAlimentacion: [],
  loading: false,
  error: null,
}

// Thunks para cargar todas las opciones
export const fetchOpcionesHijos = createAsyncThunk(
  'estiloVida/fetchOpcionesHijos',
  async () => {
    const { data, error } = await supabase
      .from('opciones_hijos')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesFrecuenciaAlcohol = createAsyncThunk(
  'estiloVida/fetchOpcionesFrecuenciaAlcohol',
  async () => {
    const { data, error } = await supabase
      .from('opciones_frecuencia_alcohol')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesFrecuenciaFumar = createAsyncThunk(
  'estiloVida/fetchOpcionesFrecuenciaFumar',
  async () => {
    const { data, error } = await supabase
      .from('opciones_frecuencia_fumar')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesEjercicio = createAsyncThunk(
  'estiloVida/fetchOpcionesEjercicio',
  async () => {
    const { data, error } = await supabase
      .from('opciones_ejercicio')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesRedesSociales = createAsyncThunk(
  'estiloVida/fetchOpcionesRedesSociales',
  async () => {
    const { data, error } = await supabase
      .from('opciones_redes_sociales')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesHabitosSueno = createAsyncThunk(
  'estiloVida/fetchOpcionesHabitosSueno',
  async () => {
    const { data, error } = await supabase
      .from('opciones_habitos_sueno')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesSignosZodiacales = createAsyncThunk(
  'estiloVida/fetchOpcionesSignosZodiacales',
  async () => {
    const { data, error } = await supabase
      .from('opciones_signos_zodiacales')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesMascotas = createAsyncThunk(
  'estiloVida/fetchOpcionesMascotas',
  async () => {
    const { data, error } = await supabase
      .from('opciones_mascotas')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

export const fetchOpcionesHabitosAlimentacion = createAsyncThunk(
  'estiloVida/fetchOpcionesHabitosAlimentacion',
  async () => {
    const { data, error } = await supabase
      .from('opciones_habitos_alimentacion')
      .select('*')
      .eq('habilitada', true)
      .order('orden')

    if (error) throw error
    return data || []
  }
)

// Thunk para cargar el estilo de vida del usuario


const estiloVidaSlice = createSlice({
  name: 'estiloVida',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearEstiloVida: (state) => {
      state.opcionesHijos = []
      state.opcionesFrecuenciaAlcohol = []
      state.opcionesFrecuenciaFumar = []
      state.opcionesEjercicio = []
      state.opcionesRedesSociales = []
      state.opcionesHabitosSueno = []
      state.opcionesSignosZodiacales = []
      state.opcionesMascotas = []
      state.opcionesHabitosAlimentacion = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Opciones Hijos
    builder
      .addCase(fetchOpcionesHijos.fulfilled, (state, action) => {
        state.opcionesHijos = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesHijos.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de hijos'
      })

    // Fetch Opciones Frecuencia Alcohol
    builder
      .addCase(fetchOpcionesFrecuenciaAlcohol.fulfilled, (state, action) => {
        state.opcionesFrecuenciaAlcohol = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesFrecuenciaAlcohol.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de frecuencia de alcohol'
      })

    // Fetch Opciones Frecuencia Fumar
    builder
      .addCase(fetchOpcionesFrecuenciaFumar.fulfilled, (state, action) => {
        state.opcionesFrecuenciaFumar = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesFrecuenciaFumar.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de frecuencia de fumar'
      })

    // Fetch Opciones Ejercicio
    builder
      .addCase(fetchOpcionesEjercicio.fulfilled, (state, action) => {
        state.opcionesEjercicio = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesEjercicio.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de ejercicio'
      })

    // Fetch Opciones Redes Sociales
    builder
      .addCase(fetchOpcionesRedesSociales.fulfilled, (state, action) => {
        state.opcionesRedesSociales = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesRedesSociales.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de redes sociales'
      })

    // Fetch Opciones Hábitos Sueño
    builder
      .addCase(fetchOpcionesHabitosSueno.fulfilled, (state, action) => {
        state.opcionesHabitosSueno = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesHabitosSueno.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de hábitos de sueño'
      })

    // Fetch Opciones Signos Zodiacales
    builder
      .addCase(fetchOpcionesSignosZodiacales.fulfilled, (state, action) => {
        state.opcionesSignosZodiacales = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesSignosZodiacales.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de signos zodiacales'
      })

    // Fetch Opciones Mascotas
    builder
      .addCase(fetchOpcionesMascotas.fulfilled, (state, action) => {
        state.opcionesMascotas = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesMascotas.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de mascotas'
      })

    // Fetch Opciones Hábitos Alimentación
    builder
      .addCase(fetchOpcionesHabitosAlimentacion.fulfilled, (state, action) => {
        state.opcionesHabitosAlimentacion = action.payload
        state.error = null
      })
      .addCase(fetchOpcionesHabitosAlimentacion.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar opciones de hábitos alimentarios'
      })

  },
})

export const { 
  clearError, 
  clearEstiloVida 
} = estiloVidaSlice.actions

export default estiloVidaSlice.reducer
