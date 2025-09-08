import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { subirArchivo, eliminarArchivo, obtenerUrlPublica } from '@/lib/supabase/storage'

export interface Foto {
  id: string
  user_id: string
  path: string
  position: number
  created_at: string
}

interface FotosState {
  fotos: Foto[]
  loading: boolean
  error: string | null
  uploading: boolean
  uploadError: string | null
}

const initialState: FotosState = {
  fotos: [],
  loading: false,
  error: null,
  uploading: false,
  uploadError: null
}

// Thunk para obtener fotos del usuario
export const fetchFotos = createAsyncThunk(
  'fotos/fetchFotos',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })

    if (error) throw error
    return data as Foto[]
  }
)

// Thunk para subir una nueva foto
export const uploadFoto = createAsyncThunk(
  'fotos/uploadFoto',
  async ({ userId, file, position }: { userId: string; file: File; position: number }) => {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    // Subir archivo al storage usando la función de utilidad
    await subirArchivo(file, fileName)

    // Obtener URL pública
    const publicUrl = obtenerUrlPublica(fileName)

    // Guardar metadata en la tabla fotos
    const { data, error } = await supabase
      .from('fotos')
      .insert({
        user_id: userId,
        path: publicUrl,
        position
      })
      .select()
      .single()

    if (error) throw error
    return data as Foto
  }
)

// Thunk para eliminar una foto
export const deleteFoto = createAsyncThunk(
  'fotos/deleteFoto',
  async ({ fotoId, path }: { fotoId: string; path: string }) => {
    // Extraer el nombre del archivo del path
    const fileName = path.split('/').pop()
    if (!fileName) throw new Error('No se pudo extraer el nombre del archivo')

    // Eliminar del storage usando la función de utilidad
    await eliminarArchivo(fileName)

    // Eliminar de la base de datos
    const { error: dbError } = await supabase
      .from('fotos')
      .delete()
      .eq('id', fotoId)

    if (dbError) throw dbError
    return fotoId
  }
)

// Thunk para reordenar fotos
export const reorderFotos = createAsyncThunk(
  'fotos/reorderFotos',
  async ({ fotos }: { fotos: { id: string; position: number }[] }) => {
    const updates = fotos.map(foto => 
      supabase
        .from('fotos')
        .update({ position: foto.position })
        .eq('id', foto.id)
    )

    const results = await Promise.all(updates)
    const errors = results.filter(result => result.error)
    
    if (errors.length > 0) {
      throw new Error('Error al reordenar las fotos')
    }

    return fotos
  }
)

const fotosSlice = createSlice({
  name: 'fotos',
  initialState,
  reducers: {
    clearFotosError: (state) => {
      state.error = null
      state.uploadError = null
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload
    }
  },
  extraReducers: (builder) => {
    // Fetch fotos
    builder
      .addCase(fetchFotos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFotos.fulfilled, (state, action) => {
        state.loading = false
        state.fotos = action.payload
      })
      .addCase(fetchFotos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar las fotos'
      })

    // Upload foto
    builder
      .addCase(uploadFoto.pending, (state) => {
        state.uploading = true
        state.uploadError = null
      })
      .addCase(uploadFoto.fulfilled, (state, action) => {
        state.uploading = false
        state.fotos.push(action.payload)
        // Reordenar por position
        state.fotos.sort((a, b) => a.position - b.position)
      })
      .addCase(uploadFoto.rejected, (state, action) => {
        state.uploading = false
        state.uploadError = action.error.message || 'Error al subir la foto'
      })

    // Delete foto
    builder
      .addCase(deleteFoto.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFoto.fulfilled, (state, action) => {
        state.loading = false
        state.fotos = state.fotos.filter(foto => foto.id !== action.payload)
      })
      .addCase(deleteFoto.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al eliminar la foto'
      })

    // Reorder fotos
    builder
      .addCase(reorderFotos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reorderFotos.fulfilled, (state, action) => {
        state.loading = false
        // Actualizar posiciones en el estado local
        action.payload.forEach(({ id, position }) => {
          const foto = state.fotos.find(f => f.id === id)
          if (foto) {
            foto.position = position
          }
        })
        // Reordenar por position
        state.fotos.sort((a, b) => a.position - b.position)
      })
      .addCase(reorderFotos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al reordenar las fotos'
      })
  }
})

export const { clearFotosError, setUploading } = fotosSlice.actions
export default fotosSlice.reducer
