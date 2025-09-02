import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthState } from '@/shared/types/auth'

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
}

// Thunks para operaciones asíncronas
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Guardar sesión en localStorage
    if (data.session) {
      localStorage.setItem('ontomatch_session', JSON.stringify(data.session))
    }
    
    return data
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
    return data
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Limpiar localStorage
    localStorage.removeItem('ontomatch_session')
  }
)

export const getSession = createAsyncThunk(
  'auth/getSession',
  async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/reset-password`,
    })
    if (error) throw error
    return { success: true }
  }
)

export const resendConfirmation = createAsyncThunk(
  'auth/resendConfirmation',
  async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })
    if (error) throw error
    return { success: true }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ password }: { password: string }) => {
    // Actualizar la contraseña directamente (ya estamos en sesión)
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    
    if (error) throw error
    
    // Cerrar sesión después de cambiar la contraseña
    await supabase.auth.signOut()
    
    return { success: true }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.session = null
      state.error = null
      localStorage.removeItem('ontomatch_session')
    },
    initializeFromStorage: (state) => {
      try {
        const storedSession = localStorage.getItem('ontomatch_session')
        if (storedSession) {
          const session = JSON.parse(storedSession)
          state.session = session
          state.user = session.user
        }
      } catch (error) {
        console.error('Error loading session from localStorage:', error)
        localStorage.removeItem('ontomatch_session')
      }
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.session = action.payload.session
        state.error = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al iniciar sesión'
      })

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.session = action.payload.session
        state.error = null
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al registrarse'
      })

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.session = null
        state.error = null
        // Limpiar localStorage también aquí para asegurar consistencia
        localStorage.removeItem('ontomatch_session')
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cerrar sesión'
      })

    // Get Session
    builder
      .addCase(getSession.pending, (state) => {
        state.loading = true
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loading = false
        state.session = action.payload.session
        state.user = action.payload.session?.user || null
      })
      .addCase(getSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al obtener la sesión'
      })

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al enviar email de recuperación'
      })

    // Resend Confirmation
    builder
      .addCase(resendConfirmation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resendConfirmation.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resendConfirmation.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al reenviar confirmación'
      })

    // Update Password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al actualizar la contraseña'
      })
  },
})

export const { 
  setUser, 
  setSession, 
  clearError, 
  setLoading, 
  clearAuth, 
  initializeFromStorage 
} = authSlice.actions

export default authSlice.reducer
