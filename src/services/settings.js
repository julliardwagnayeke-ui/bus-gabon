import { supabase } from '../supabase';

// Singleton : la table platform_settings n'a qu'une ligne (id = 'singleton').
const SETTINGS_ID = 'singleton';

export const SETTINGS_DEFAULTS = {
  commissionRate:            0.05,  // 5%
  serviceFee:                200,   // FCFA
  reservationExpiryMinutes:  10,    // minutes
};

// Ligne DB (snake_case, commission en %) → modèle app (commissionRate en ratio).
function mapSettings(row) {
  if (!row) return { ...SETTINGS_DEFAULTS };
  return {
    commissionRate:           row.commission_percentage != null ? row.commission_percentage / 100 : SETTINGS_DEFAULTS.commissionRate,
    serviceFee:               row.user_fee_per_ticket ?? SETTINGS_DEFAULTS.serviceFee,
    reservationExpiryMinutes: row.reservation_block_time ?? SETTINGS_DEFAULTS.reservationExpiryMinutes,
  };
}

export async function getSettings() {
  const { data, error } = await supabase
    .from('platform_settings').select('*').eq('id', SETTINGS_ID).maybeSingle();
  if (error || !data) return { ...SETTINGS_DEFAULTS };
  return mapSettings(data);
}

export async function updateSettings(data) {
  const row = { id: SETTINGS_ID };
  if (typeof data.commissionRate           === 'number') row.commission_percentage = data.commissionRate * 100;
  if (typeof data.serviceFee               === 'number') row.user_fee_per_ticket   = data.serviceFee;
  if (typeof data.reservationExpiryMinutes === 'number') row.reservation_block_time = data.reservationExpiryMinutes;

  const { error } = await supabase
    .from('platform_settings').upsert(row, { onConflict: 'id' });
  if (error) throw error;
}
