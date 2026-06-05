import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export async function getAgencyRoutes(agencyId) {
  const snap = await getDocs(query(collection(db, 'routes'), where('agencyId', '==', agencyId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createRoute(agencyId, data) {
  return addDoc(collection(db, 'routes'), { ...data, agencyId, status: 'active', createdAt: serverTimestamp() });
}

export async function updateRoute(id, data) {
  return updateDoc(doc(db, 'routes', id), data);
}

export async function deleteRoute(id) {
  return deleteDoc(doc(db, 'routes', id));
}
