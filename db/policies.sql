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

-- Phase 3 — étape 1 (agencies) : lecture publique
alter table public.agencies enable row level security;
grant select on public.agencies to anon, authenticated;
drop policy if exists "agencies_select_public" on public.agencies;
create policy "agencies_select_public" on public.agencies for select to anon, authenticated using (true);

-- Phase 3 — étape 2 (routes, buses)
create or replace function public.my_agency_id()
returns uuid language sql stable security definer set search_path=public as $$
  select agency_id from public.profiles where id = auth.uid()
$$;
alter table public.routes enable row level security;
grant select on public.routes to anon;
grant select, insert, update, delete on public.routes to authenticated;
drop policy if exists "routes_select_public" on public.routes;
create policy "routes_select_public" on public.routes for select to anon, authenticated using (true);
drop policy if exists "routes_write_own" on public.routes;
create policy "routes_write_own" on public.routes for all to authenticated
  using (agency_id = public.my_agency_id()) with check (agency_id = public.my_agency_id());
alter table public.buses enable row level security;
grant select, insert, update, delete on public.buses to authenticated;
drop policy if exists "buses_all_own" on public.buses;
create policy "buses_all_own" on public.buses for all to authenticated
  using (agency_id = public.my_agency_id()) with check (agency_id = public.my_agency_id());

-- Phase 3 — étape 3 (departures) : lecture publique + écriture agence
alter table public.departures enable row level security;
grant select on public.departures to anon;
grant select, insert, update, delete on public.departures to authenticated;
drop policy if exists "departures_select_public" on public.departures;
create policy "departures_select_public" on public.departures for select to anon, authenticated using (true);
drop policy if exists "departures_write_own" on public.departures;
create policy "departures_write_own" on public.departures for all to authenticated
  using (agency_id = public.my_agency_id()) with check (agency_id = public.my_agency_id());
