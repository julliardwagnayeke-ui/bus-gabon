/**
 * Crée un utilisateur BusGabon DÉJÀ confirmé (contourne la confirmation email),
 * puis fixe son rôle dans `profiles`. Idéal pour bootstrapper le 1er admin.
 *
 * Usage :
 *   npm run create-user -- --email admin@busgabon.ga --password 'MotDePasse!' --name "Admin" --role super_admin
 *
 * Rôles : client | super_admin | finance_admin | support_admin | operations_admin | content_admin
 *
 * Utilise l'API REST Supabase (clé secrète) — aucune dépendance, pas de souci WebSocket.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

const ROLES = [
  'client',
  'super_admin',
  'finance_admin',
  'support_admin',
  'operations_admin',
  'content_admin',
];

function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(`--${flag}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  if (!url || !secret) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SECRET_KEY manquante (cf .env.local).');
    process.exit(1);
  }

  const email = getArg('email');
  const password = getArg('password');
  const name = getArg('name') ?? '';
  const role = getArg('role') ?? 'client';

  if (!email || !password) {
    console.error(
      'Usage : npm run create-user -- --email <email> --password <pwd> [--name "Nom"] [--role super_admin]',
    );
    process.exit(1);
  }
  if (!ROLES.includes(role)) {
    console.error(`❌ Rôle invalide "${role}". Choix : ${ROLES.join(', ')}`);
    process.exit(1);
  }

  const headers = {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  };

  // 1) Création de l'utilisateur (email_confirm = true → connexion immédiate)
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error('❌ Création échouée :', body.msg || body.error_description || JSON.stringify(body));
    process.exit(1);
  }
  const userId: string = body.id;
  console.log(`✓ Utilisateur créé : ${email}  (id: ${userId})`);

  // 2) Rôle + nom dans profiles (la clé secrète contourne la RLS)
  const patch = await fetch(`${url}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ role, full_name: name || null }),
  });
  const profile = await patch.json();
  if (!patch.ok) {
    console.error('⚠️ Utilisateur créé, mais mise à jour du profil échouée :', profile);
    process.exit(1);
  }
  if (!Array.isArray(profile) || profile.length === 0) {
    console.warn('⚠️ Aucun profil mis à jour — le trigger handle_new_user a-t-il bien créé la ligne ?');
  } else {
    console.log(`✓ Profil mis à jour : rôle = ${role}`);
  }

  console.log(`\n✅ Terminé. Connecte-toi sur /connexion avec ${email}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
