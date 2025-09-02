import { User, Session } from '@supabase/supabase-js'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}
