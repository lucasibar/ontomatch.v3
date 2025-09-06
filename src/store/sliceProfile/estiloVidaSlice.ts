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

// Tipos para el formulario de estilo de vida
export interface EstiloVidaFormData {
  hijos_id: string
  frecuencia_alcohol_id: string
  frecuencia_fumar_id: string
  ejercicio_id: string
  redes_sociales_id: string
  habitos_sueno_id: string
  signo_zodiacal_id: string
  mascotas_id: string
  habitos_alimentacion_id: string
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
  
  // Estado del formulario
  formData: EstiloVidaFormData
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
  
  // Estado del formulario
  formData: {
    hijos_id: '',
    frecuencia_alcohol_id: '',
    frecuencia_fumar_id: '',
    ejercicio_id: '',
    redes_sociales_id: '',
    habitos_sueno_id: '',
    signo_zodiacal_id: '',
    mascotas_id: '',
    habitos_alimentacion_id: ''
  },
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

// Thunk para actualizar estilo de vida
export const updateEstiloVida = createAsyncThunk(
  'estiloVida/updateEstiloVida',
  async (estiloVidaData: EstiloVidaFormData & { profileId: string }) => {
    // Buscar si ya existe un registro para este usuario
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('estilo_vida_id')
      .eq('id', estiloVidaData.profileId)
      .single()

    let result
    if (profileData?.estilo_vida_id) {
      // Actualizar registro existente
      const { data, error } = await supabase
        .from('estilos_vida')
        .update({
          hijos_id: estiloVidaData.hijos_id || null,
          frecuencia_alcohol_id: estiloVidaData.frecuencia_alcohol_id || null,
          frecuencia_fumar_id: estiloVidaData.frecuencia_fumar_id || null,
          ejercicio_id: estiloVidaData.ejercicio_id || null,
          redes_sociales_id: estiloVidaData.redes_sociales_id || null,
          habitos_sueno_id: estiloVidaData.habitos_sueno_id || null,
          signo_zodiacal_id: estiloVidaData.signo_zodiacal_id || null,
          mascotas_id: estiloVidaData.mascotas_id || null,
          habitos_alimentacion_id: estiloVidaData.habitos_alimentacion_id || null,
        })
        .eq('id', profileData.estilo_vida_id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Crear nuevo registro
      const { data, error } = await supabase
        .from('estilos_vida')
        .insert({
          hijos_id: estiloVidaData.hijos_id || null,
          frecuencia_alcohol_id: estiloVidaData.frecuencia_alcohol_id || null,
          frecuencia_fumar_id: estiloVidaData.frecuencia_fumar_id || null,
          ejercicio_id: estiloVidaData.ejercicio_id || null,
          redes_sociales_id: estiloVidaData.redes_sociales_id || null,
          habitos_sueno_id: estiloVidaData.habitos_sueno_id || null,
          signo_zodiacal_id: estiloVidaData.signo_zodiacal_id || null,
          mascotas_id: estiloVidaData.mascotas_id || null,
          habitos_alimentacion_id: estiloVidaData.habitos_alimentacion_id || null,
        })
        .select()
        .single()

      if (error) throw error
      result = data
      
      // Actualizar el profile con el nuevo estilo_vida_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ estilo_vida_id: result.id })
        .eq('id', estiloVidaData.profileId)
      
      if (updateError) {
        throw updateError
      }
    }

    return result
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
      state.opcionesHijos = []
      state.opcionesFrecuenciaAlcohol = []
      state.opcionesFrecuenciaFumar = []
      state.opcionesEjercicio = []
      state.opcionesRedesSociales = []
      state.opcionesHabitosSueno = []
      state.opcionesSignosZodiacales = []
      state.opcionesMascotas = []
      state.opcionesHabitosAlimentacion = []
      state.formData = initialState.formData
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
