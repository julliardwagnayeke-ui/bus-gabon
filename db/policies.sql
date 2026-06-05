-- Policies RLS Supabase appliquées à la base (à rejouer si besoin).
-- Appliqué via : psql "$DIRECT_URL" -f db/policies.sql
--
-- Phase 2 (auth) : un utilisateur lit / met à jour SON propre profil.

grant usage on schema public to authenticated, anon;
grant select, update on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Phase 3 : ajouter ici les policies pour agencies, routes, departures,
-- reservations, tickets, payments, etc. (traduction de _legacy/firestore.rules).
