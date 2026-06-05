'use server';

import { prisma } from '@/server/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;

export interface AgencyRegistrationInput {
  agency: { name: string; city: string; phone: string; email?: string; description?: string };
  account: { managerName: string; loginEmail: string; loginPhone?: string; password: string };
}

type Result = { ok: true } | { ok: false; error: string };

/**
 * Onboarding agence : crée le compte gestionnaire (Supabase, confirmé),
 * l'agence en statut `pending_review`, et rattache l'utilisateur comme `owner`.
 */
export async function registerAgencyAction(input: AgencyRegistrationInput): Promise<Result> {
  if (!SUPABASE_URL || !SECRET) return { ok: false, error: 'Configuration serveur manquante.' };

  const { agency, account } = input;
  const email = account.loginEmail.trim().toLowerCase();

  if (!agency.name.trim() || !agency.city || !agency.phone.trim())
    return { ok: false, error: 'Informations agence incomplètes.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Email invalide.' };
  if (account.password.length < 8) return { ok: false, error: 'Mot de passe : 8 caractères minimum.' };

  const headers = {
    apikey: SECRET,
    Authorization: `Bearer ${SECRET}`,
    'Content-Type': 'application/json',
  };

  // 1) Compte Supabase (déjà confirmé)
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.managerName.trim(), phone: account.loginPhone ?? '' },
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    const msg = String(body.msg || body.error_description || '').toLowerCase();
    return {
      ok: false,
      error:
        msg.includes('already') || msg.includes('registered')
          ? 'Cet email est déjà utilisé.'
          : 'Création du compte impossible.',
    };
  }
  const userId: string = body.id;

  // 2) Agence + rattachement (le profil est créé par le trigger handle_new_user)
  try {
    const created = await prisma.agency.create({
      data: {
        name: agency.name.trim(),
        mainCity: agency.city,
        phone: agency.phone.trim(),
        email: agency.email?.trim() || null,
        description: agency.description?.trim() || null,
        status: 'pending_review',
      },
    });
    await prisma.profile.upsert({
      where: { id: userId },
      update: { agencyId: created.id, fullName: account.managerName.trim() },
      create: { id: userId, email, fullName: account.managerName.trim(), agencyId: created.id },
    });
    await prisma.agencyUser.create({
      data: { agencyId: created.id, userId, role: 'owner', status: 'active' },
    });
  } catch {
    return {
      ok: false,
      error: "Le compte a été créé mais l'agence n'a pas pu être enregistrée. Contactez le support.",
    };
  }

  return { ok: true };
}
