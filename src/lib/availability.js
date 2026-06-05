import { db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

/**
 * Calcule les places disponibles pour un départ.
 * placesRestantes = totalSeats - billets payés - réservations pending non expirées
 */
export async function getAvailableSeats(departureId, totalSeats) {
  const now = Timestamp.now();

  const [paidSnap, pendingSnap] = await Promise.all([
    getDocs(query(
      collection(db, 'tickets'),
      where('departureId', '==', departureId),
      where('status', '==', 'paid')
    )),
    getDocs(query(
      collection(db, 'reservations'),
      where('departureId', '==', departureId),
      where('status', '==', 'pending_payment'),
      where('expiresAt', '>', now)
    )),
  ]);

  const paidCount = paidSnap.docs.reduce((acc, d) => acc + (d.data().ticketCount || 1), 0);
  const pendingCount = pendingSnap.docs.reduce((acc, d) => acc + (d.data().ticketCount || 1), 0);

  return Math.max(0, totalSeats - paidCount - pendingCount);
}
