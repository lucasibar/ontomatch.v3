// Profile Slice
export { default as profileReducer } from './profileSlice'
export { 
  clearProfile, 
  updateProfile,
  updateProfileLocal,
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
  clearEstiloVida,
  fetchOpcionesHijos,
  fetchOpcionesFrecuenciaAlcohol,
  fetchOpcionesFrecuenciaFumar,
  fetchOpcionesEjercicio,
  fetchOpcionesRedesSociales,
  fetchOpcionesHabitosSueno,
  fetchOpcionesSignosZodiacales,
  fetchOpcionesMascotas,
  fetchOpcionesHabitosAlimentacion
} from './estiloVidaSlice'

// Intereses Slice
export { default as interesesReducer } from './interesesSlice'
export { 
  clearError as clearInteresesError, 
  clearIntereses,
  fetchIntereses,
  fetchCategoriasIntereses
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

// Info Profesional Slice
export { default as infoProfesionalReducer } from './infoProfesionalSlice'
export { 
  clearError as clearInfoProfesionalError, 
  updateFormData as updateInfoProfesionalFormData,
  clearFormData as clearInfoProfesionalFormData,
  fetchInfoProfesionalUsuario,
  updateInfoProfesional
} from './infoProfesionalSlice'

// Fotos Slice
export { default as fotosReducer } from './fotosSlice'
export { 
  fetchFotos, 
  uploadFoto, 
  deleteFoto, 
  reorderFotos,
  clearFotosError,
  setUploading 
} from './fotosSlice'