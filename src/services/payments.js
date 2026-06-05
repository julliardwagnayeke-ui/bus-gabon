import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { generateTicketsForReservation } from './tickets';
import { getReservation } from './reservations';

export async function initiatePayment({ reservationId, userId, agencyId, amount, method, phone }) {
  const payRef = await addDoc(collection(db, 'payments'), {
    reservationId, userId, agencyId, amount, method,
    phone: phone || null,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return payRef.id;
}

/**
 * Simulation paiement : confirme immédiatement.
 * À remplacer par un vrai appel API (Airtel / Moov) en production.
 */
export async function confirmPaymentSimulation(paymentId, reservationId) {
  await updateDoc(doc(db, 'payments', paymentId), {
    status: 'success',
    confirmedAt: serverTimestamp(),
  });

  const reservation = await getReservation(reservationId);
  if (!reservation) throw new Error('Réservation introuvable');

  const ticketIds = await generateTicketsForReservation(reservation);
  return ticketIds;
}

export async function failPayment(paymentId, reservationId) {
  await updateDoc(doc(db, 'payments', paymentId), { status: 'failed', updatedAt: serverTimestamp() });
  await updateDoc(doc(db, 'reservations', reservationId), { status: 'payment_failed', updatedAt: serverTimestamp() });
}

// ── Stubs (référencés par Checkout) — à implémenter en Phase 3 (Supabase + SingPay) ──
// processPayment : déclenchera le paiement Mobile Money via SingPay.
export async function processPayment() {
  throw new Error('processPayment : à implémenter (Phase 3 — SingPay/Supabase)');
}

// subscribeToPayment : suivra le statut du paiement (Supabase Realtime).
// Renvoie une fonction de désinscription (no-op pour l'instant).
export function subscribeToPayment(_paymentId, _onChange) {
  return () => {};
}
