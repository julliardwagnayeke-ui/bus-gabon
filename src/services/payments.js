import { supabase } from '../supabase';
import { generateTicketsForReservation } from './tickets';
import { getReservation } from './reservations';

// L'enum PaymentMethod en base = airtel | moov | card.
// 'simulation' (démo) est rangé sous 'card'.
function dbMethod(method) {
  return method === 'airtel' || method === 'moov' ? method : 'card';
}

export async function initiatePayment({ reservationId, userId, agencyId, amount, method, phone }) {
  const { data, error } = await supabase
    .from('payments')
    .upsert({
      reservation_id: reservationId,
      amount,
      method: dbMethod(method),
      provider: 'singpay',
      status: 'pending',
      raw_payload: { phone: phone || null, userId: userId || null, agencyId: agencyId || null },
    }, { onConflict: 'reservation_id' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

/**
 * Confirmation du paiement (mock manuel — pas encore branché sur SingPay).
 * Marque le paiement payé, génère les billets et incrémente les places vendues.
 */
export async function confirmPayment(paymentId, reservationId) {
  await supabase.from('payments').update({ status: 'paid' }).eq('id', paymentId);

  const reservation = await getReservation(reservationId);
  if (!reservation) throw new Error('Réservation introuvable');

  return generateTicketsForReservation(reservation);
}

export async function failPayment(paymentId, reservationId) {
  await supabase.from('payments').update({ status: 'failed' }).eq('id', paymentId);
  await supabase
    .from('reservations')
    .update({ status: 'cancelled', payment_status: 'failed' })
    .eq('id', reservationId);
}

/**
 * Déclenche le paiement. En mode mock, tous les modes confirment immédiatement
 * et renvoient les identifiants des billets générés.
 * À remplacer par l'intégration SingPay (redirection + webhook) en production.
 */
export async function processPayment({ paymentId, reservationId }) {
  return confirmPayment(paymentId, reservationId);
}

// Admin : liste de tous les paiements (lecture transverse via policy admin).
export async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('id, reservation_id, amount, method, status, created_at')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    reservationId: p.reservation_id,
    amount: p.amount,
    method: p.method,
    status: p.status,
    createdAt: p.created_at,
  }));
}

// Suivi temps réel du paiement (no-op tant que SingPay n'est pas branché).
export function subscribeToPayment(_paymentId, _onChange) {
  return () => {};
}
