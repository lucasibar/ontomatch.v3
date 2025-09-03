import { configureStore } from '@reduxjs/toolkit'
import authReducer from './sliceAuth/authSlice'
import { 
  profileReducer, 
  ubicacionReducer, 
  generosReducer, 
  estiloVidaReducer,
  interesesReducer,
  queBuscoReducer
} from './sliceProfile'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ubicacion: ubicacionReducer,
    generos: generosReducer,
    estiloVida: estiloVidaReducer,
    intereses: interesesReducer,
    queBusco: queBuscoReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
