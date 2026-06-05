import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export async function getAgencyBuses(agencyId) {
  const snap = await getDocs(query(collection(db, 'buses'), where('agencyId', '==', agencyId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createBus(agencyId, data) {
  return addDoc(collection(db, 'buses'), { ...data, agencyId, status: 'active', createdAt: serverTimestamp() });
}

export async function updateBus(id, data) {
  return updateDoc(doc(db, 'buses', id), data);
}

export async function deleteBus(id) {
  return deleteDoc(doc(db, 'buses', id));
}
