import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Routes nécessitant une session authentifiée.
const PROTECTED_PREFIXES = ['/agence', '/admin', '/mes-billets', '/profil', '/checkout', '/paiement'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT : ne pas insérer de code entre createServerClient et getClaims().
  // Cet appel rafraîchit le token et propage les cookies de session.
  // `data` est null pour une requête anonyme → on gère ce cas.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  // Redirige les visiteurs non connectés qui tentent d'accéder à une zone protégée.
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!claims && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
