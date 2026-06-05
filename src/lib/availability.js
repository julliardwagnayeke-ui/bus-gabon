import { supabase } from '../supabase';

/**
 * Places disponibles pour un départ = open_seats - sold_seats.
 * (sold_seats est la source de vérité, mise à jour à la confirmation de paiement.)
 * Lecture sur `departures` (table publique) → pas d'exposition des tickets/réservations.
 */
export async function getAvailableSeats(departureId, fallbackTotal) {
  const { data, error } = await supabase
    .from('departures')
    .select('open_seats, sold_seats')
    .eq('id', departureId)
    .single();
  if (error || !data) return fallbackTotal ?? 0;
  return Math.max(0, (data.open_seats ?? 0) - (data.sold_seats ?? 0));
}
