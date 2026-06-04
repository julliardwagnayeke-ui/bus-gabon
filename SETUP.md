# BusGabon — Guide de démarrage

Plateforme de vente de billets de bus en ligne (Gabon), multi-agences.
Stack : **Next.js 15 + Supabase (Postgres/Auth/Storage) + Prisma + SingPay**.

## Prérequis
- Node 20+, npm
- Supabase CLI (`supabase --version`)
- Un projet Supabase (cloud) — ou Docker pour le Supabase local

---

## 1. Installation
```bash
npm install
```

## 2. Créer le projet Supabase
1. Sur https://supabase.com → **New project** (région la plus proche : `eu-west` ou `eu-central`).
2. Récupère les clés et chaînes de connexion :
   - **Project Settings → API** : `Project URL`, `anon key`, `service_role key`
   - **Project Settings → Database → Connection string** : versions *pooler* (6543) et *direct* (5432)

## 3. Configurer les variables d'environnement
- Remplis **`.env`** (lu par Prisma) :
  - `DATABASE_URL` = chaîne **pooler** (`...pooler.supabase.com:6543/postgres?pgbouncer=true`)
  - `DIRECT_URL`   = chaîne **directe** (`...pooler.supabase.com:5432/postgres`)
- Remplis **`.env.local`** (lu par Next.js) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, puis les clés SingPay / Resend / WhatsApp au fur et à mesure.

> `.env.example` documente toutes les variables attendues.

## 4. Appliquer le schéma à la base
La migration initiale est déjà générée (`prisma/migrations/*_init/`). Au choix :
```bash
# applique les migrations existantes telles quelles
npx prisma migrate deploy

# OU (en dev, recrée/synchronise et nomme une nouvelle migration si besoin)
npm run prisma:migrate
```

## 5. Charger les données de base (villes du Gabon + réglages)
```bash
npm run db:seed
```

## 6. Lancer l'app
```bash
npm run dev      # http://localhost:3000
```

Outils utiles :
```bash
npm run prisma:studio   # explorateur de la base
npm run db:reset        # reset complet + re-migrate + re-seed (dev uniquement)
```

---

## Architecture des dossiers
```
prisma/            schéma + migrations + seed (Postgres)
supabase/          config CLI + (à venir) migrations RLS & Edge Functions
src/
  app/             routes Next.js (public, auth, client, agency, admin, api)
  server/          ★ logique serveur — db.ts (Prisma), actions/, services/
  components/       UI (réutilisée de l'ancien frontend)
  hooks/ lib/ types/
_legacy/           ancien code archivé (Vite, Express, Firebase) — non versionné
```

## Reste à faire (suite du plan)
3. Auth Supabase (`profiles` + trigger SQL, middleware, guards RBAC) — *remplace les imports Firebase encore présents*
4. Policies RLS (traduites depuis `_legacy/firestore.rules`)
5. Parcours client → agence → admin
6. Paiement SingPay + webhooks · 7. Notifications (Resend/WhatsApp) · 8. Tests/CI/déploiement
