# Configuración del Sistema de Fotos

## Requisitos Previos

Para que el sistema de fotos funcione correctamente, necesitás configurar el bucket "avatars" en Supabase Storage.

## Configuración del Bucket en Supabase

### 1. Crear el Bucket

1. Ve a tu proyecto de Supabase
2. Navega a **Storage** en el menú lateral
3. Haz clic en **New bucket**
4. Configura el bucket con los siguientes parámetros:
   - **Name**: `avatars`
   - **Public bucket**: ✅ (marcado)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### 2. Configurar Políticas de Seguridad (RLS)

Necesitás crear políticas para que los usuarios puedan:
- Subir sus propias fotos
- Ver sus propias fotos
- Eliminar sus propias fotos

#### Política para INSERT (Subir fotos)
```sql
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Política para SELECT (Ver fotos)
```sql
CREATE POLICY "Users can view their own photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Política para DELETE (Eliminar fotos)
```sql
CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Configurar la Tabla `fotos`

Asegurate de que la tabla `fotos` tenga la siguiente estructura:

```sql
CREATE TABLE fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_fotos_user_id ON fotos(user_id);
CREATE INDEX idx_fotos_position ON fotos(user_id, position);

-- RLS habilitado
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propias fotos
CREATE POLICY "Users can view their own photos" ON fotos
FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios solo inserten sus propias fotos
CREATE POLICY "Users can insert their own photos" ON fotos
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo actualicen sus propias fotos
CREATE POLICY "Users can update their own photos" ON fotos
FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios solo eliminen sus propias fotos
CREATE POLICY "Users can delete their own photos" ON fotos
FOR DELETE USING (auth.uid() = user_id);
```

## Funcionalidades Implementadas

### 1. Componente FotosPerfil
- Muestra la primera foto en un círculo
- Indica la cantidad de fotos subidas
- Botón para editar fotos
- Validación visual del estado (faltan fotos, completo, etc.)

### 2. Página de Edición de Fotos (`/perfil/fotos`)
- Drag & drop para subir fotos
- Preview de fotos seleccionadas
- Eliminación de fotos individuales
- Reordenamiento de fotos
- Validación de tipos de archivo (JPG, PNG, WebP)
- Límite de 6 fotos máximo

### 3. Validación en el Formulario
- Mínimo 3 fotos requeridas
- Validación en tiempo real
- Error mostrado si no se cumplen los requisitos

### 4. Redux Store
- Estado centralizado de fotos
- Thunks para operaciones asíncronas
- Manejo de errores

## Estructura de Archivos

```
src/
├── components/profile/forms/
│   └── FotosPerfil.tsx          # Componente principal de fotos
├── app/perfil/
│   └── fotos/
│       └── page.tsx             # Página de edición de fotos
├── features/profile/hooks/
│   └── useFotos.ts              # Hook personalizado para fotos
├── lib/supabase/
│   └── storage.ts               # Funciones de utilidad para storage
└── store/sliceProfile/
    └── fotosSlice.ts            # Redux slice para fotos
```

## Uso

### En el Formulario de Perfil
El componente `FotosPerfil` se integra automáticamente en el formulario de perfil y valida que el usuario tenga al menos 3 fotos antes de permitir el envío.

### Navegación
- Desde el perfil: botón "Editar Fotos" → `/perfil/fotos`
- Desde la página de fotos: botón "Volver" → regresa al perfil

### Validaciones
- **Tipos de archivo**: Solo JPG, PNG, WebP
- **Tamaño máximo**: 5MB por archivo
- **Cantidad**: Mínimo 3, máximo 6 fotos
- **Formato**: Las fotos se almacenan en formato rectangular optimizado para móvil

## Notas Técnicas

- Las fotos se almacenan en el bucket `avatars` con la estructura: `{userId}/{timestamp}.{ext}`
- Se genera una URL pública para cada foto
- Los metadatos se guardan en la tabla `fotos` con posición para ordenamiento
- El sistema maneja automáticamente la limpieza de archivos huérfanos
