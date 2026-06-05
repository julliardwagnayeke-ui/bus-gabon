# BusGabon — note projet

Plateforme de vente de billets de bus en ligne (Gabon), multi-agences.

**Stack : Vite + React 19 + React Router + Tailwind v4 + Supabase** (auth + Postgres).

- L'app est à la racine (`src/`). Lancer : `npm run dev` (Vite, port 5173).
- Ancien code archivé (non versionné) : `_legacy/` (backend Express, Firebase functions) et `_next_app/` (tentative Next.js).
- Migration en cours : l'app Vite était câblée sur Firebase ; on la re-câble sur **Supabase** (auth `supabase-js` côté client + tables Postgres, accès régi par RLS).
