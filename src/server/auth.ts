import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Profile, Role } from '@prisma/client';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/server/db';

const PLATFORM_ADMIN_ROLES: Role[] = [
  'super_admin',
  'finance_admin',
  'support_admin',
  'operations_admin',
  'content_admin',
];

/** Utilisateur Supabase courant (session via cookies), ou null. */
export async function getSupabaseUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Profil Prisma de l'utilisateur courant. Upsert défensif : si le profil
 * n'existe pas encore (utilisateur créé avant le trigger, ou edge case),
 * il est créé à partir des infos Supabase.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getSupabaseUser();
  if (!user) return null;

  return prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? '',
      fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
      phone: (user.user_metadata?.phone as string | undefined) ?? null,
    },
  });
}

/** Exige une session ; redirige vers /connexion sinon. */
export async function requireUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/connexion');
  return profile;
}

export function isPlatformAdmin(role: Role): boolean {
  return PLATFORM_ADMIN_ROLES.includes(role);
}

/** Exige un rôle d'administration plateforme. */
export async function requirePlatformAdmin(): Promise<Profile> {
  const profile = await requireUser();
  if (!isPlatformAdmin(profile.role)) redirect('/');
  return profile;
}

/** Exige l'appartenance à une agence (membre du staff agence). */
export async function requireAgencyMember(): Promise<Profile> {
  const profile = await requireUser();
  if (!profile.agencyId) redirect('/');
  return profile;
}
