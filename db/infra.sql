-- Infra DB pour permettre les écritures via supabase-js (le schéma vient de
-- Prisma, où id/updated_at sont gérés côté application — pas de défaut DB).
-- Appliqué via : psql "$DIRECT_URL" -f db/infra.sql

-- updated_at : valeur par défaut now() + trigger qui le met à jour sur UPDATE.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $fn$
begin new.updated_at = now(); return new; end $fn$;

do $do$
declare t record;
begin
  for t in select table_name from information_schema.columns
           where table_schema='public' and column_name='updated_at' loop
    execute format('alter table public.%I alter column updated_at set default now()', t.table_name);
    execute format('drop trigger if exists set_updated_at on public.%I', t.table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t.table_name);
  end loop;
end $do$;

-- id uuid : default gen_random_uuid() (sauf profiles dont l'id = auth.users.id).
do $do$
declare t record;
begin
  for t in select table_name from information_schema.columns
           where table_schema='public' and column_name='id' and data_type='uuid'
             and column_default is null and table_name <> 'profiles' loop
    execute format('alter table public.%I alter column id set default gen_random_uuid()', t.table_name);
  end loop;
end $do$;
