import { supabase } from '../supabase';

function mapRoute(r) {
  if (!r) return null;
  return {
    id: r.id,
    agencyId: r.agency_id,
    originCity: r.from_city,
    destinationCity: r.to_city,
    fromCity: r.from_city,
    toCity: r.to_city,
    fromStation: r.from_station,
    toStation: r.to_station,
    basePrice: r.base_price,
    estimatedDuration: r.estimated_duration,
    baggageIncluded: r.baggage_included,
    baggageMaxWeight: r.max_baggage_weight,
    baggageExtraFee: r.extra_baggage_fee,
    description: r.description,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function routeToRow(d = {}) {
  const row = {};
  const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
  if (d.originCity !== undefined || d.fromCity !== undefined) row.from_city = d.originCity ?? d.fromCity;
  if (d.destinationCity !== undefined || d.toCity !== undefined) row.to_city = d.destinationCity ?? d.toCity;
  if (d.fromStation !== undefined) row.from_station = d.fromStation;
  if (d.toStation !== undefined) row.to_station = d.toStation;
  if (d.basePrice !== undefined) row.base_price = num(d.basePrice);
  if (d.estimatedDuration !== undefined) row.estimated_duration = d.estimatedDuration === '' ? null : String(d.estimatedDuration);
  if (d.baggageIncluded !== undefined) row.baggage_included = num(d.baggageIncluded) ?? 1;
  if (d.baggageMaxWeight !== undefined) row.max_baggage_weight = num(d.baggageMaxWeight);
  if (d.baggageExtraFee !== undefined) row.extra_baggage_fee = num(d.baggageExtraFee);
  if (d.description !== undefined) row.description = d.description;
  if (d.status !== undefined) row.status = d.status;
  return row;
}

export async function getAgencyRoutes(agencyId) {
  const { data, error } = await supabase
    .from('routes').select('*').eq('agency_id', agencyId).order('from_city');
  if (error) return [];
  return data.map(mapRoute);
}

export async function createRoute(agencyId, data) {
  const { data: row, error } = await supabase
    .from('routes')
    .insert({ ...routeToRow(data), agency_id: agencyId, status: data.status || 'active' })
    .select().single();
  if (error) throw error;
  return mapRoute(row);
}

export async function updateRoute(id, data) {
  const { error } = await supabase.from('routes').update(routeToRow(data)).eq('id', id);
  if (error) throw error;
}

export async function deleteRoute(id) {
  const { error } = await supabase.from('routes').delete().eq('id', id);
  if (error) throw error;
}
