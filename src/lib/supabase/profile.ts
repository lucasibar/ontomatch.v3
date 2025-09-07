import { createSupabaseServerClient } from './client-server';

export type MinimalProfile = {
  id: string;
  descripcion?: string | null;
  nombre_completo: string | null;
  genero_primario_id: string | null;
  ubicacion_id: string | null;
  escuela_coaching_id: string | null;
  orientacion_sexual_id: string | null;
  edad_min: number | null;
  edad_max: number | null;
  distancia_maxima: number | null;
  info_basica_cargada: boolean | null;
  que_busco_id: string | null;
};

export async function getSessionAndProfile() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { session: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      descripcion,
      nombre_completo,
      genero_primario_id,
      ubicacion_id,
      escuela_coaching_id,
      orientacion_sexual_id,
      edad_min,
      edad_max,
      distancia_maxima,
      info_basica_cargada,
      que_busco_id
    `)
    .eq('id', session.user.id)
    .single();

  if (error) {
    return { session, profile: null };
  }

  return { session, profile };
}

export function isProfileComplete(p?: MinimalProfile | null) {
  if (!p) return false;
  const isComplete = p.info_basica_cargada === true;
  
  return isComplete; // única fuente de verdad
}
