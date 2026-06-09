import { supabase } from '../supabase';
import { logActivity } from './activityLogs';

// Ligne Supabase (snake_case) → objet attendu par les composants (camelCase).
function mapAgency(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo_url,
    logoUrl: row.logo_url,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    mainCity: row.main_city,
    mainStation: row.main_station,
    description: row.description,
    operatingHours: row.operating_hours,
    baggagePolicy: row.baggage_policy,
    cancellationPolicy: row.cancellation_policy,
    status: row.status,
    verified: row.verified_badge,
    verifiedBadge: row.verified_badge,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// camelCase (entrée composant) → colonnes snake_case (écriture).
function toRow(data = {}) {
  const map = {
    name: 'name', slug: 'slug', logo: 'logo_url', logoUrl: 'logo_url',
    phone: 'phone', whatsapp: 'whatsapp', email: 'email', address: 'address',
    mainCity: 'main_city', mainStation: 'main_station', description: 'description',
    operatingHours: 'operating_hours', baggagePolicy: 'baggage_policy',
    cancellationPolicy: 'cancellation_policy', status: 'status', verifiedBadge: 'verified_badge',
  };
  const row = {};
  for (const [k, v] of Object.entries(data)) {
    if (map[k] !== undefined) row[map[k]] = v;
  }
  return row;
}

export async function getAgency(id) {
  const { data, error } = await supabase.from('agencies').select('*').eq('id', id).single();
  if (error) return null;
  return mapAgency(data);
}

export async function getActiveAgencies() {
  const { data, error } = await supabase.from('agencies').select('*').eq('status', 'active');
  if (error) return [];
  return data.map(mapAgency);
}

export async function getVerifiedAgencies(max = 6) {
  const { data, error } = await supabase
    .from('agencies').select('*').eq('verified_badge', true).limit(max);
  if (error) return [];
  return data.map(mapAgency);
}

export async function getAllAgencies() {
  const { data, error } = await supabase.from('agencies').select('*').order('name');
  if (error) return [];
  return data.map(mapAgency);
}

export async function createAgency(data) {
  const { data: row, error } = await supabase
    .from('agencies')
    .insert({ ...toRow(data), status: 'pending_review', verified_badge: false })
    .select()
    .single();
  if (error) throw error;
  return mapAgency(row);
}

export async function updateAgency(id, data) {
  const { error } = await supabase.from('agencies').update(toRow(data)).eq('id', id);
  if (error) throw error;
}

export async function approveAgency(id) {
  const { error } = await supabase
    .from('agencies').update({ status: 'active', verified_badge: true }).eq('id', id);
  if (error) throw error;
  logActivity({ action: 'agency.approved', entityType: 'agency', entityId: id });
}

export async function suspendAgency(id) {
  const { error } = await supabase.from('agencies').update({ status: 'suspended' }).eq('id', id);
  if (error) throw error;
  logActivity({ action: 'agency.suspended', entityType: 'agency', entityId: id });
}

// Onboarding partenaire : crée le compte (auth) + l'agence (pending_review) et
// rattache le profil. Le compte gérant devient agency_admin (via agency_id).
export async function registerAgency(agencyData, accountData) {
  const { data: signUp, error: signErr } = await supabase.auth.signUp({
    email: accountData.loginEmail,
    password: accountData.password,
    options: { data: { full_name: accountData.managerName, phone: accountData.loginPhone } },
  });
  if (signErr) {
    const m = signErr.message?.toLowerCase() || '';
    if (m.includes('already') || m.includes('registered')) {
      throw new Error('Cet email est déjà utilisé.');
    }
    throw signErr;
  }
  // Sans session (confirmation email activée), impossible de créer l'agence ici.
  if (!signUp.session) {
    throw new Error('Compte créé. Confirmez votre email puis reconnectez-vous pour finaliser votre agence.');
  }

  const { data: agencyId, error: rpcErr } = await supabase.rpc('register_agency', {
    p_name:        agencyData.name,
    p_main_city:   agencyData.city,
    p_phone:       agencyData.phone,
    p_email:       agencyData.email,
    p_description: agencyData.description,
  });
  if (rpcErr) throw rpcErr;
  return agencyId;
}
