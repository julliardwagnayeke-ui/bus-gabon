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

-- Phase 3 — étape 4 (reservations, tickets, payments) : parcours d'achat.
-- Modèle : le client gère ses propres réservations/billets/paiements ;
-- l'agence voit/valide ceux qui la concernent.

-- ── reservations ──────────────────────────────────────────────────────────
alter table public.reservations enable row level security;
grant select, insert, update on public.reservations to authenticated;

drop policy if exists "reservations_select_own" on public.reservations;
create policy "reservations_select_own" on public.reservations for select to authenticated
  using (user_id = auth.uid() or agency_id = public.my_agency_id());

drop policy if exists "reservations_insert_own" on public.reservations;
create policy "reservations_insert_own" on public.reservations for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "reservations_update_scope" on public.reservations;
create policy "reservations_update_scope" on public.reservations for update to authenticated
  using (user_id = auth.uid() or agency_id = public.my_agency_id())
  with check (user_id = auth.uid() or agency_id = public.my_agency_id());

-- ── tickets ───────────────────────────────────────────────────────────────
alter table public.tickets enable row level security;
grant select, insert, update on public.tickets to authenticated;

drop policy if exists "tickets_select_scope" on public.tickets;
create policy "tickets_select_scope" on public.tickets for select to authenticated
  using (
    agency_id = public.my_agency_id()
    or exists (select 1 from public.reservations r where r.id = reservation_id and r.user_id = auth.uid())
  );

drop policy if exists "tickets_insert_own" on public.tickets;
create policy "tickets_insert_own" on public.tickets for insert to authenticated
  with check (exists (select 1 from public.reservations r where r.id = reservation_id and r.user_id = auth.uid()));

-- L'agence valide (scan) les billets qui la concernent.
drop policy if exists "tickets_update_agency" on public.tickets;
create policy "tickets_update_agency" on public.tickets for update to authenticated
  using (agency_id = public.my_agency_id()) with check (agency_id = public.my_agency_id());

-- ── payments ──────────────────────────────────────────────────────────────
alter table public.payments enable row level security;
grant select, insert, update on public.payments to authenticated;

drop policy if exists "payments_select_scope" on public.payments;
create policy "payments_select_scope" on public.payments for select to authenticated
  using (exists (
    select 1 from public.reservations r where r.id = reservation_id
      and (r.user_id = auth.uid() or r.agency_id = public.my_agency_id())
  ));

drop policy if exists "payments_write_own" on public.payments;
create policy "payments_write_own" on public.payments for all to authenticated
  using (exists (select 1 from public.reservations r where r.id = reservation_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.reservations r where r.id = reservation_id and r.user_id = auth.uid()));

-- ── RPC : confirmation de paiement ─────────────────────────────────────────
-- Le client ne peut pas écrire sur departures (réservé à l'agence) ; cette
-- fonction passe la réservation à 'confirmed/paid' ET incrémente sold_seats
-- de façon atomique, après vérification que l'appelant en est bien le titulaire.
create or replace function public.confirm_reservation(p_reservation_id uuid, p_seats int)
returns void language plpgsql security definer set search_path = public as $$
declare v_departure uuid;
begin
  update public.reservations
     set status = 'confirmed', payment_status = 'paid', total_paid = total_amount, paid_at = now()
   where id = p_reservation_id and user_id = auth.uid()
  returning departure_id into v_departure;
  if v_departure is null then
    raise exception 'Réservation introuvable ou non autorisée';
  end if;
  update public.departures set sold_seats = coalesce(sold_seats, 0) + p_seats where id = v_departure;
end $$;
grant execute on function public.confirm_reservation(uuid, int) to authenticated;

-- ── RPC : vérification publique d'un billet (anon) ─────────────────────────
-- Expose uniquement les champs nécessaires (pas de téléphone, etc.) sans
-- ouvrir la table tickets en lecture publique.
create or replace function public.verify_ticket_code(p_code text)
returns table (passenger_name text, status text, route text, departure_date date, departure_time text)
language sql security definer set search_path = public as $$
  select t.passenger_name, t.status::text,
         r.from_city || ' → ' || r.to_city as route,
         d.departure_date, d.departure_time
    from public.tickets t
    join public.departures d on d.id = t.departure_id
    join public.routes r on r.id = d.route_id
   where t.code = p_code
   limit 1
$$;
grant execute on function public.verify_ticket_code(text) to anon, authenticated;

-- Phase 3 — étape 5 (admin plateforme) : lecture transverse pour les admins.
create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
     where id = auth.uid()
       and role in ('super_admin','finance_admin','support_admin','operations_admin','content_admin')
  )
$$;
grant execute on function public.is_platform_admin() to authenticated;

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "reservations_select_admin" on public.reservations;
create policy "reservations_select_admin" on public.reservations for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "payments_select_admin" on public.payments;
create policy "payments_select_admin" on public.payments for select to authenticated
  using (public.is_platform_admin());

-- Phase 3 — étape 6 (platform_settings, payouts, activity_logs).

-- ── platform_settings ─────────────────────────────────────────────────────
-- Lecture publique (config non sensible : commission, frais) ; écriture admin.
alter table public.platform_settings enable row level security;
grant select on public.platform_settings to anon, authenticated;
grant insert, update on public.platform_settings to authenticated;
drop policy if exists "platform_settings_select_public" on public.platform_settings;
create policy "platform_settings_select_public" on public.platform_settings for select to anon, authenticated using (true);
drop policy if exists "platform_settings_write_admin" on public.platform_settings;
create policy "platform_settings_write_admin" on public.platform_settings for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ── payouts ───────────────────────────────────────────────────────────────
-- L'admin gère tous les versements ; l'agence lit les siens.
alter table public.payouts enable row level security;
grant select, insert, update on public.payouts to authenticated;
drop policy if exists "payouts_select_scope" on public.payouts;
create policy "payouts_select_scope" on public.payouts for select to authenticated
  using (public.is_platform_admin() or agency_id = public.my_agency_id());
drop policy if exists "payouts_write_admin" on public.payouts;
create policy "payouts_write_admin" on public.payouts for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ── activity_logs ─────────────────────────────────────────────────────────
-- Insertion par l'acteur lui-même ; lecture réservée aux admins.
alter table public.activity_logs enable row level security;
grant select, insert on public.activity_logs to authenticated;
drop policy if exists "activity_logs_insert_self" on public.activity_logs;
create policy "activity_logs_insert_self" on public.activity_logs for insert to authenticated
  with check (actor_id = auth.uid());
drop policy if exists "activity_logs_select_admin" on public.activity_logs;
create policy "activity_logs_select_admin" on public.activity_logs for select to authenticated
  using (public.is_platform_admin());

-- Phase 3 — étape 7 (onboarding agence).
-- Crée une agence en pending_review et rattache le profil de l'appelant.
-- SECURITY DEFINER : l'insert sur agencies n'est pas ouvert aux clients ; on
-- contrôle ici que l'appelant n'est pas déjà rattaché à une agence.
create or replace function public.register_agency(
  p_name text, p_main_city text, p_phone text, p_email text, p_description text
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;
  if (select agency_id from public.profiles where id = auth.uid()) is not null then
    raise exception 'Profil déjà rattaché à une agence';
  end if;
  insert into public.agencies (name, slug, main_city, phone, email, description, status, verified_badge)
  values (
    p_name,
    lower(regexp_replace(coalesce(p_name,'agence'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6),
    p_main_city, p_phone, p_email, p_description, 'pending_review', false
  )
  returning id into v_id;
  update public.profiles set agency_id = v_id where id = auth.uid();
  return v_id;
end $$;
grant execute on function public.register_agency(text, text, text, text, text) to authenticated;

-- Phase 3 — étape 8 (édition agence par le gérant + validation admin).
-- Le gérant édite SES infos (colonnes "sûres" uniquement) ; status & verified_badge
-- restent réservés à l'admin (via la RPC set_agency_status).
grant update (name, logo_url, phone, whatsapp, email, address, main_city, main_station,
              description, operating_hours, baggage_policy, cancellation_policy)
  on public.agencies to authenticated;
drop policy if exists "agencies_update_own" on public.agencies;
create policy "agencies_update_own" on public.agencies for update to authenticated
  using (id = public.my_agency_id()) with check (id = public.my_agency_id());

create or replace function public.set_agency_status(
  p_agency_id uuid, p_status text, p_verified boolean default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Réservé aux administrateurs';
  end if;
  update public.agencies
     set status = p_status::"AgencyStatus",
         verified_badge = coalesce(p_verified, verified_badge)
   where id = p_agency_id;
end $$;
grant execute on function public.set_agency_status(uuid, text, boolean) to authenticated;
