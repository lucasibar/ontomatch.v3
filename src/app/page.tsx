import { redirect } from 'next/navigation';

export default async function HomeRouter() {
  // El middleware ya maneja todas las redirecciones basadas en sesión y perfil
  // Solo redirigimos a swipes como página por defecto
  return redirect('/swipes');
}
