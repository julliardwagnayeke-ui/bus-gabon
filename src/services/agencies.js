import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, query,
  where, orderBy, serverTimestamp,
} from 'firebase/firestore';

export async function getAgency(id) {
  const snap = await getDoc(doc(db, 'agencies', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getActiveAgencies() {
  const snap = await getDocs(query(collection(db, 'agencies'), where('status', '==', 'active')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getVerifiedAgencies(max = 6) {
  try {
    const snap = await getDocs(query(collection(db, 'agencies'), where('verified', '==', true)));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return list.slice(0, max);
  } catch {
    return [];
  }
}

export async function getAllAgencies() {
  const snap = await getDocs(query(collection(db, 'agencies'), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createAgency(data) {
  return addDoc(collection(db, 'agencies'), {
    ...data,
    status: 'pending_review',
    verified: false,
    verifiedBadge: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAgency(id, data) {
  return updateDoc(doc(db, 'agencies', id), { ...data, updatedAt: serverTimestamp() });
}

export async function approveAgency(id) {
  return updateDoc(doc(db, 'agencies', id), { status: 'active', verified: true, verifiedBadge: true, updatedAt: serverTimestamp() });
}

export async function suspendAgency(id) {
  return updateDoc(doc(db, 'agencies', id), { status: 'suspended', updatedAt: serverTimestamp() });
}
