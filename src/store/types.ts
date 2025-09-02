import { User, Session } from '@supabase/supabase-js'

// Estado de autenticación
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}
