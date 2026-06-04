import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/server/auth';

// Renvoie le profil de l'utilisateur courant (session Supabase → Prisma).
export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(profile);
}
