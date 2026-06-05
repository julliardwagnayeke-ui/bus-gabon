import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';

export async function getDeparture(id) {
  const snap = await getDoc(doc(db, 'departures', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function searchDepartures({ originCity, destinationCity, date }) {
  // Récupérer les routes correspondant à la recherche
  const routesSnap = await getDocs(query(
    collection(db, 'routes'),
    where('originCity', '==', originCity),
    where('destinationCity', '==', destinationCity),
    where('status', '==', 'active')
  ));
  const routeIds = routesSnap.docs.map(d => d.id);
  const routesMap = Object.fromEntries(routesSnap.docs.map(d => [d.id, { id: d.id, ...d.data() }]));

  if (routeIds.length === 0) return [];

  // Récupérer les départs pour ces routes à la date donnée
  const results = [];
  for (const routeId of routeIds) {
    const snap = await getDocs(query(
      collection(db, 'departures'),
      where('routeId', '==', routeId),
      where('departureDate', '==', date),
      where('status', '==', 'scheduled'),
      orderBy('departureTime')
    ));
    snap.docs.forEach(d => results.push({ id: d.id, ...d.data(), route: routesMap[routeId] }));
  }

  return results;
}

export async function getAgencyDepartures(agencyId) {
  const snap = await getDocs(query(
    collection(db, 'departures'),
    where('agencyId', '==', agencyId),
    orderBy('departureDate', 'desc')
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createDeparture(agencyId, data) {
  return addDoc(collection(db, 'departures'), {
    ...data, agencyId, status: 'scheduled', createdAt: serverTimestamp(),
  });
}

export async function updateDeparture(id, data) {
  return updateDoc(doc(db, 'departures', id), data);
}
