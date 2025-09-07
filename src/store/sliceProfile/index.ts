// Profile Slice
export { default as profileReducer } from './profileSlice'
export { 
  clearProfile, 
  updateProfile,
  fetchProfile,
  clearError as clearProfileError
} from './profileSlice'

// Ubicación Slice
export { default as ubicacionReducer } from './ubicacionSlice'
export { 
  clearUbicaciones, 
  fetchUbicaciones,
  clearError as clearUbicacionError
} from './ubicacionSlice'

// Géneros Slice
export { default as generosReducer } from './generosSlice'
export { 
  clearGeneros, 
  fetchGenerosPrimarios, 
  fetchGenerosSecundarios,
  clearError as clearGenerosError
} from './generosSlice'

// Estilo de Vida Slice
export { default as estiloVidaReducer } from './estiloVidaSlice'
export { 
  clearError as clearEstiloVidaError, 
  updateFormData, 
  resetFormData, 
  clearEstiloVida,
  fetchOpcionesHijos,
  fetchOpcionesFrecuenciaAlcohol,
  fetchOpcionesFrecuenciaFumar,
  fetchOpcionesEjercicio,
  fetchOpcionesRedesSociales,
  fetchOpcionesHabitosSueno,
  fetchOpcionesSignosZodiacales,
  fetchOpcionesMascotas,
  fetchOpcionesHabitosAlimentacion,
  fetchEstiloVidaUsuario,
  updateEstiloVida
} from './estiloVidaSlice'

// Intereses Slice
export { default as interesesReducer } from './interesesSlice'
export { 
  clearError as clearInteresesError, 
  toggleInteres, 
  setInteresesSeleccionados, 
  clearIntereses,
  fetchIntereses,
  fetchCategoriasIntereses,
  fetchInteresesUsuario,
  guardarInteresesUsuario
} from './interesesSlice'

// Qué Busco Slice
export { default as queBuscoReducer } from './queBuscoSlice'
export { 
  clearError as clearQueBuscoError, 
  clearQueBusco,
  fetchOpcionesQueBusco
} from './queBuscoSlice'

// Orientación Sexual Slice
export { default as orientacionSexualReducer } from './orientacionSexualSlice'
export { 
  clearError as clearOrientacionSexualError, 
  clearOrientacionSexual,
  fetchOpcionesOrientacionSexual
} from './orientacionSexualSlice'

// Escuelas Coaching Slice
export { default as escuelasCoachingReducer } from './escuelasCoachingSlice'
export { 
  clearError as clearEscuelasCoachingError, 
  clearEscuelasCoaching,
  setEscuelaSeleccionada,
  fetchEscuelasCoaching,
  crearEscuelaCoaching
} from './escuelasCoachingSlice'
