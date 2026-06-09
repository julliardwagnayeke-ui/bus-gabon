import { supabase } from '../supabase';

function mapProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    agencyId: row.agency_id,
    createdAt: row.created_at,
  };
}

// Admin : liste des utilisateurs (lecture transverse via policy admin).
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, agency_id, created_at')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(mapProfile);
}

// Met à jour son propre profil (RLS : profiles_update_own).
export async function updateMyProfile(userId, { name, phone }) {
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: name, phone })
    .eq('id', userId);
  if (error) throw error;
}
