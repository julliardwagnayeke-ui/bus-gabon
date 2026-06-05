import { supabase } from '../supabase';

// Statut « réservable » dans notre enum (équivalent de l'ancien 'scheduled').
const BOOKABLE = 'published';

function mapRoute(r) {
  if (!r) return null;
  return {
    id: r.id,
    agencyId: r.agency_id,
    originCity: r.from_city,
    destinationCity: r.to_city,
    fromCity: r.from_city,
    toCity: r.to_city,
    basePrice: r.base_price,
    estimatedDuration: r.estimated_duration,
    baggageIncluded: r.baggage_included,
    status: r.status,
  };
}

function mapDeparture(d) {
  if (!d) return null;
  const open = d.open_seats ?? 0;
  const sold = d.sold_seats ?? 0;
  return {
    id: d.id,
    agencyId: d.agency_id,
    routeId: d.route_id,
    busId: d.bus_id,
    departureDate: d.departure_date,
    departureTime: d.departure_time,
    estimatedArrivalTime: d.estimated_arrival_time,
    arrivalTime: d.estimated_arrival_time,
    ticketPrice: d.ticket_price,
    price: d.ticket_price,
    openSeats: open,
    soldSeats: sold,
    availableSeats: Math.max(0, open - sold),
    baggageIncluded: d.baggage_included,
    maxBookingPerReservation: d.max_booking_per_reservation,
    maxTicketsPerOrder: d.max_booking_per_reservation,
    fromStation: d.from_station,
    toStation: d.to_station,
    specialConditions: d.special_conditions,
    status: d.status,
    route: d.routes ? mapRoute(d.routes) : undefined,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

function depToRow(data = {}) {
  const row = {};
  const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
  if (data.routeId !== undefined) row.route_id = data.routeId;
  if (data.busId !== undefined) row.bus_id = data.busId;
  if (data.departureDate !== undefined) row.departure_date = data.departureDate;
  if (data.departureTime !== undefined) row.departure_time = data.departureTime;
  if (data.estimatedArrivalTime !== undefined) row.estimated_arrival_time = data.estimatedArrivalTime || null;
  if (data.totalSeats !== undefined || data.openSeats !== undefined) row.open_seats = num(data.totalSeats ?? data.openSeats) ?? 0;
  if (data.maxTicketsPerOrder !== undefined || data.maxBookingPerReservation !== undefined) {
    row.max_booking_per_reservation = num(data.maxTicketsPerOrder ?? data.maxBookingPerReservation) ?? 4;
  }
  if (data.baggageIncluded !== undefined) row.baggage_included = num(data.baggageIncluded) ?? 1;
  if (data.ticketPrice !== undefined) row.ticket_price = num(data.ticketPrice);
  // 'scheduled' (ancien) → 'published'
  if (data.status !== undefined) row.status = data.status === 'scheduled' ? BOOKABLE : data.status;
  return row;
}

export async function getDeparture(id) {
  const { data, error } = await supabase
    .from('departures')
    .select('*, routes(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapDeparture(data);
}

export async function searchDepartures({ originCity, destinationCity, date }) {
  const { data, error } = await supabase
    .from('departures')
    .select('*, routes!inner(*)')
    .eq('departure_date', date)
    .eq('status', BOOKABLE)
    .eq('routes.from_city', originCity)
    .eq('routes.to_city', destinationCity)
    .eq('routes.status', 'active')
    .order('departure_time');
  if (error) {
    console.warn('[searchDepartures]', error.message);
    return [];
  }
  return data.map(mapDeparture);
}

export async function getAgencyDepartures(agencyId) {
  const { data, error } = await supabase
    .from('departures')
    .select('*, routes(*)')
    .eq('agency_id', agencyId)
    .order('departure_date', { ascending: false });
  if (error) return [];
  return data.map(mapDeparture);
}

export async function createDeparture(agencyId, data) {
  const row = depToRow(data);
  // Le prix vient de la ligne si non fourni explicitement.
  if (row.ticket_price == null && row.route_id) {
    const { data: r } = await supabase.from('routes').select('base_price').eq('id', row.route_id).single();
    row.ticket_price = r?.base_price ?? 0;
  }
  const { data: created, error } = await supabase
    .from('departures')
    .insert({ ...row, agency_id: agencyId, status: row.status || BOOKABLE })
    .select('*, routes(*)')
    .single();
  if (error) throw error;
  return mapDeparture(created);
}

export async function updateDeparture(id, data) {
  const { error } = await supabase.from('departures').update(depToRow(data)).eq('id', id);
  if (error) throw error;
}
