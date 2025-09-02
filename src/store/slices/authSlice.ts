import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthState } from '../types'

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
  },
})

export const { setUser, setSession, clearError, setLoading } = authSlice.actions
export default authSlice.reducer
