import { supabase } from '../supabase';

function mapBus(b) {
  if (!b) return null;
  return {
    id: b.id,
    agencyId: b.agency_id,
    name: b.name,
    code: b.code,
    plateNumber: b.license_plate,
    licensePlate: b.license_plate,
    capacity: b.capacity,
    type: b.type,
    description: b.description,
    equipment: b.equipment,
    photoUrl: b.photo_url,
    status: b.status,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  };
}

function busToRow(d = {}) {
  const row = {};
  if (d.name !== undefined) row.name = d.name;
  if (d.code !== undefined) row.code = d.code;
  if (d.plateNumber !== undefined || d.licensePlate !== undefined) row.license_plate = d.plateNumber ?? d.licensePlate;
  if (d.capacity !== undefined) row.capacity = Number(d.capacity);
  if (d.type !== undefined) row.type = d.type;
  if (d.description !== undefined) row.description = d.description;
  if (d.equipment !== undefined) row.equipment = d.equipment;
  if (d.photoUrl !== undefined) row.photo_url = d.photoUrl;
  if (d.status !== undefined) row.status = d.status;
  return row;
}

export async function getAgencyBuses(agencyId) {
  const { data, error } = await supabase
    .from('buses').select('*').eq('agency_id', agencyId).order('name');
  if (error) return [];
  return data.map(mapBus);
}

export async function createBus(agencyId, data) {
  const { data: row, error } = await supabase
    .from('buses')
    .insert({ ...busToRow(data), agency_id: agencyId, status: data.status || 'active' })
    .select().single();
  if (error) throw error;
  return mapBus(row);
}

export async function updateBus(id, data) {
  const { error } = await supabase.from('buses').update(busToRow(data)).eq('id', id);
  if (error) throw error;
}

export async function deleteBus(id) {
  const { error } = await supabase.from('buses').delete().eq('id', id);
  if (error) throw error;
}
