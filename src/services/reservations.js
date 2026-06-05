import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, query,
  where, orderBy, Timestamp, serverTimestamp,
} from 'firebase/firestore';
import { calcPricing } from '../lib/pricing';
import { getAvailableSeats } from '../lib/availability';

export async function getReservation(id) {
  const snap = await getDoc(doc(db, 'reservations', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getUserReservations(userId) {
  const snap = await getDocs(query(
    collection(db, 'reservations'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAgencyReservations(agencyId) {
  const snap = await getDocs(query(
    collection(db, 'reservations'),
    where('agencyId', '==', agencyId),
    orderBy('createdAt', 'desc')
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createReservation({ userId, departureId, agencyId, routeId, unitPrice, ticketCount, passengerName, passengerPhone, passengerEmail }) {
  const departure = await getDoc(doc(db, 'departures', departureId));
  if (!departure.exists()) throw new Error('Départ introuvable');
  const dep = departure.data();

  const available = await getAvailableSeats(departureId, dep.totalSeats);
  if (available < ticketCount) throw new Error('Places insuffisantes');

  const pricing = calcPricing(unitPrice, ticketCount);
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));

  const ref = await addDoc(collection(db, 'reservations'), {
    userId, departureId, agencyId, routeId,
    passengerName, passengerPhone, passengerEmail,
    ticketCount,
    unitPrice: pricing.unitPrice,
    serviceFee: pricing.serviceFee,
    totalAmount: pricing.totalClient,
    agencyAmount: pricing.agencyAmount,
    platformAmount: pricing.platformRevenue,
    status: 'pending_payment',
    expiresAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function cancelReservation(id) {
  return updateDoc(doc(db, 'reservations', id), { status: 'cancelled', updatedAt: serverTimestamp() });
}

export async function expireStaleReservations() {
  const now = Timestamp.now();
  const snap = await getDocs(query(
    collection(db, 'reservations'),
    where('status', '==', 'pending_payment'),
    where('expiresAt', '<', now)
  ));
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { status: 'expired', updatedAt: serverTimestamp() })));
}
