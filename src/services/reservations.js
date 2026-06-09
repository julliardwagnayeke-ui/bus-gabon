import { supabase } from '../supabase';
import { calcPricing, SERVICE_FEE } from '../lib/pricing';
import { getAvailableSeats } from '../lib/availability';
import { generatePublicCode } from '../lib/ticketCode';
import { logActivity } from './activityLogs';

// Sélection enrichie : la réservation + le départ + la route (pour l'affichage).
const SELECT = '*, departures(departure_date, departure_time, agency_id, route_id, ticket_price, routes(from_city, to_city))';

// Ligne Supabase (snake_case) → objet attendu par les composants (camelCase).
function mapReservation(row) {
  if (!row) return null;
  const dep = row.departures || null;
  const route = dep?.routes || null;
  const unitPrice = dep?.ticket_price ?? 0;
  // ticket_count n'est pas stocké : on le reconstruit depuis le montant total
  // (total = unitPrice * count + SERVICE_FEE, cf. calcPricing).
  const ticketCount = unitPrice > 0
    ? Math.max(1, Math.round((row.total_amount - SERVICE_FEE) / unitPrice))
    : null;
  return {
    id: row.id,
    code: row.code,
    departureId: row.departure_id,
    agencyId: row.agency_id,
    userId: row.user_id,
    passengerName: row.client_name,
    clientName: row.client_name,
    passengerPhone: row.client_phone,
    clientPhone: row.client_phone,
    passengerEmail: row.client_email,
    clientEmail: row.client_email,
    totalAmount: row.total_amount,
    totalPaid: row.total_paid,
    paymentStatus: row.payment_status,
    // 'confirmed' (enum DB) est affiché 'paid' côté UI (libellés des pages).
    status: row.status === 'confirmed' ? 'paid' : row.status,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Champs dérivés du départ/route pour l'affichage (MyTickets, AgencyReservations…)
    departureDate: dep?.departure_date,
    departureTime: dep?.departure_time,
    routeId: dep?.route_id,
    unitPrice,
    originCity: route?.from_city,
    destinationCity: route?.to_city,
    ticketCount,
  };
}

export async function getReservation(id) {
  const { data, error } = await supabase.from('reservations').select(SELECT).eq('id', id).single();
  if (error) return null;
  return mapReservation(data);
}

export async function getUserReservations(userId) {
  const { data, error } = await supabase
    .from('reservations').select(SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(mapReservation);
}

export async function getAgencyReservations(agencyId) {
  const { data, error } = await supabase
    .from('reservations').select(SELECT)
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(mapReservation);
}

export async function createReservation({
  userId, departureId, agencyId, unitPrice, ticketCount,
  passengerName, passengerPhone, passengerEmail,
}) {
  const available = await getAvailableSeats(departureId);
  if (available < ticketCount) throw new Error('Places insuffisantes');

  const pricing = calcPricing(unitPrice, ticketCount);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      code: generatePublicCode(),
      departure_id: departureId,
      agency_id: agencyId,
      user_id: userId || null,
      client_name: passengerName,
      client_phone: passengerPhone,
      client_email: passengerEmail || null,
      total_amount: pricing.totalClient,
      payment_status: 'pending',
      status: 'pending_payment',
      expires_at: expiresAt,
    })
    .select('id')
    .single();
  if (error) throw error;
  logActivity({ userId, action: 'reservation.created', entityType: 'reservation', entityId: data.id, metadata: { ticketCount } });
  return data.id;
}

// Admin : toutes les réservations payées (statut DB 'confirmed'), enrichies du
// détail de prix recalculé (non stocké en base) pour les vues revenus.
export async function getPaidReservations() {
  const { data, error } = await supabase
    .from('reservations').select(SELECT)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map((row) => {
    const r = mapReservation(row);
    const p = calcPricing(r.unitPrice || 0, r.ticketCount || 0);
    return {
      ...r,
      serviceFee: p.serviceFee,
      commission: p.commission,
      agencyAmount: p.agencyAmount,
      platformAmount: p.platformRevenue,
    };
  });
}

export async function cancelReservation(id) {
  const { error } = await supabase
    .from('reservations').update({ status: 'cancelled' }).eq('id', id);
  if (error) throw error;
}

export async function expireStaleReservations() {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled', payment_status: 'expired' })
    .eq('status', 'pending_payment')
    .lt('expires_at', now);
  if (error) throw error;
}
