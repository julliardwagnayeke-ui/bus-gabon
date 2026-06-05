import { db } from '../firebase';
import {
  collection, doc, addDoc, getDocs, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { logActivity } from './activityLogs';

/**
 * Calcule un aperçu de versement pour une agence sur une période donnée.
 * Filtre côté client pour éviter les index composites Firestore.
 */
export async function calculatePayoutPreview(agencyId, fromDate, toDate) {
  const snap = await getDocs(query(
    collection(db, 'reservations'),
    where('agencyId', '==', agencyId),
    where('status',   '==', 'paid'),
  ));

  const from = new Date(fromDate);
  const to   = new Date(toDate);
  to.setHours(23, 59, 59, 999);

  const reservations = snap.docs
    .map(d => d.data())
    .filter(r => {
      if (!r.paidAt) return false;
      const paidAt = r.paidAt.toDate ? r.paidAt.toDate() : new Date(r.paidAt);
      return paidAt >= from && paidAt <= to;
    });

  const reservationCount = reservations.length;
  const ticketCount      = reservations.reduce((s, r) => s + (r.ticketCount    || 0), 0);
  const agencyNetAmount  = reservations.reduce((s, r) => s + (r.agencyAmount   || 0), 0);
  const serviceFeeAmount = reservations.reduce((s, r) => s + (r.serviceFee     || 0), 0);
  const platformRevenue  = reservations.reduce((s, r) => s + (r.platformAmount || 0), 0);
  // subtotal = totalAmount - serviceFee (totalClient = subtotal + serviceFee)
  const grossSalesAmount = reservations.reduce((s, r) => s + ((r.totalAmount || 0) - (r.serviceFee || 0)), 0);
  const commissionAmount = platformRevenue - serviceFeeAmount;

  return {
    reservationCount,
    ticketCount,
    grossSalesAmount,
    commissionAmount,
    serviceFeeAmount,
    agencyNetAmount,
    platformRevenue,
  };
}

/**
 * Crée un document de versement dans Firestore.
 */
export async function createPayout({ agencyId, agencyName, periodStart, periodEnd, ...amounts }) {
  const ref = await addDoc(collection(db, 'agency_payouts'), {
    agencyId,
    agencyName: agencyName || '',
    periodStart,
    periodEnd,
    ...amounts,
    status:    'pending',
    paidAt:    null,
    notes:     '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  logActivity({
    agencyId,
    action:     'agency.payout_created',
    entityType: 'agency_payout',
    entityId:   ref.id,
    metadata:   { agencyName, agencyNetAmount: amounts.agencyNetAmount, periodStart, periodEnd },
  });

  return ref.id;
}

/**
 * Retourne la liste des versements (tous ou filtrés par agence).
 */
export async function getPayouts(agencyId) {
  const constraints = [orderBy('createdAt', 'desc')];
  if (agencyId) constraints.unshift(where('agencyId', '==', agencyId));

  const snap = await getDocs(query(collection(db, 'agency_payouts'), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Marque un versement comme payé.
 */
export async function markPayoutPaid(payoutId, notes = '') {
  await updateDoc(doc(db, 'agency_payouts', payoutId), {
    status:    'paid',
    paidAt:    serverTimestamp(),
    notes,
    updatedAt: serverTimestamp(),
  });

  logActivity({
    action:     'agency.payout_paid',
    entityType: 'agency_payout',
    entityId:   payoutId,
    metadata:   { notes },
  });
}
