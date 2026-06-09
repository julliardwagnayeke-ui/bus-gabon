import { supabase } from '../supabase';
import { generatePublicCode, buildQrPayload, parseQrPayload } from '../lib/ticketCode';
import { logActivity } from './activityLogs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Sélection enrichie pour l'affichage (route + date du départ).
const SELECT = '*, departures(departure_date, departure_time, routes(from_city, to_city))';

function mapTicket(row) {
  if (!row) return null;
  const dep = row.departures || null;
  const route = dep?.routes || null;
  return {
    id: row.id,
    code: row.code,
    publicCode: row.code,
    reservationId: row.reservation_id,
    departureId: row.departure_id,
    agencyId: row.agency_id,
    passengerName: row.passenger_name,
    passengerPhone: row.passenger_phone,
    qrPayload: row.qr_payload,
    status: row.status,
    validatedAt: row.validated_at,
    validatedBy: row.validated_by,
    createdAt: row.created_at,
    departureDate: dep?.departure_date,
    departureTime: dep?.departure_time,
    route: route ? `${route.from_city} → ${route.to_city}` : undefined,
  };
}

export async function generateTicketsForReservation(reservation) {
  const { id: reservationId, departureId, agencyId, passengerName, passengerPhone, ticketCount } = reservation;
  const count = ticketCount || 1;

  const rows = [];
  for (let i = 0; i < count; i++) {
    const id = crypto.randomUUID();
    const code = generatePublicCode();
    rows.push({
      id,
      code,
      reservation_id: reservationId,
      departure_id: departureId,
      agency_id: agencyId,
      passenger_name: passengerName,
      passenger_phone: passengerPhone || null,
      qr_payload: buildQrPayload(id, code),
      status: 'active',
    });
  }

  const { data, error } = await supabase.from('tickets').insert(rows).select('id');
  if (error) throw error;

  // Confirme la réservation (confirmed/paid) et incrémente sold_seats de façon
  // atomique côté serveur (RLS : le client ne peut pas écrire sur departures).
  const { error: rpcError } = await supabase.rpc('confirm_reservation', {
    p_reservation_id: reservationId,
    p_seats: count,
  });
  if (rpcError) throw rpcError;

  return data.map(d => d.id);
}

export async function getUserTickets(userId) {
  const { data, error } = await supabase
    .from('tickets')
    .select(`${SELECT}, reservations!inner(user_id)`)
    .eq('reservations.user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(mapTicket);
}

export async function getTicket(id) {
  const { data, error } = await supabase.from('tickets').select(SELECT).eq('id', id).single();
  if (error) return null;
  return mapTicket(data);
}

export async function getReservationTickets(reservationId) {
  const { data, error } = await supabase
    .from('tickets').select(SELECT).eq('reservation_id', reservationId);
  if (error) return [];
  return data.map(mapTicket);
}

export async function verifyTicket(payload, agencyId = null, markAsUsed = false) {
  const parsed = parseQrPayload(payload);
  const code = parsed.code || payload;

  const { data, error } = await supabase.from('tickets').select(SELECT).eq('code', code).maybeSingle();
  if (error || !data) {
    return { valid: false, message: 'Billet introuvable. Code invalide.' };
  }
  const ticket = mapTicket(data);

  if (ticket.status === 'used') {
    return { valid: false, alreadyUsed: true, message: 'Ce billet a déjà été utilisé.', ticket: ticketInfo(ticket) };
  }
  if (ticket.status === 'cancelled') {
    return { valid: false, message: 'Ce billet a été annulé.' };
  }
  if (ticket.status === 'expired') {
    return { valid: false, message: 'Ce billet est expiré.' };
  }
  if (ticket.status !== 'active') {
    return { valid: false, message: `Ce billet n'est pas valide (statut : ${ticket.status}).` };
  }

  if (markAsUsed) {
    await supabase
      .from('tickets')
      .update({
        status: 'used',
        validated_at: new Date().toISOString(),
        validated_by: UUID_RE.test(agencyId) ? agencyId : null,
      })
      .eq('id', ticket.id);
    logActivity({ agencyId: ticket.agencyId, action: 'ticket.validated', entityType: 'ticket', entityId: ticket.id });
  }

  return { valid: true, message: 'Billet valide. Bon voyage !', ticket: ticketInfo(ticket) };
}

// Vérification publique (anon) : passe par une fonction SECURITY DEFINER qui
// n'expose que les champs utiles, sans ouvrir la table tickets en lecture.
export async function verifyTicketPublic(payload) {
  const parsed = parseQrPayload(payload);
  const code = parsed.code || payload;

  const { data, error } = await supabase
    .rpc('verify_ticket_code', { p_code: code })
    .maybeSingle();
  if (error || !data) {
    return { valid: false, message: 'Billet introuvable. Code invalide.' };
  }

  const info = {
    passengerName: data.passenger_name,
    route: data.route || '—',
    departureDate: data.departure_date || '—',
    departureTime: data.departure_time || '—',
    publicCode: code,
    status: data.status,
  };

  if (data.status === 'used')      return { valid: false, alreadyUsed: true, message: 'Ce billet a déjà été utilisé.', ticket: info };
  if (data.status === 'cancelled') return { valid: false, message: 'Ce billet a été annulé.' };
  if (data.status === 'expired')   return { valid: false, message: 'Ce billet est expiré.' };
  if (data.status !== 'active')    return { valid: false, message: `Ce billet n'est pas valide (statut : ${data.status}).` };

  return { valid: true, message: 'Billet valide. Bon voyage !', ticket: info };
}

function ticketInfo(ticket) {
  return {
    passengerName: ticket.passengerName,
    route: ticket.route || '—',
    departureDate: ticket.departureDate || '—',
    departureTime: ticket.departureTime || '—',
    publicCode: ticket.publicCode,
    status: ticket.status,
  };
}
