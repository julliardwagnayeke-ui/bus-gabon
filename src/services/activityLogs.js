import { db } from '../firebase';
import {
  collection, addDoc, getDocs, query,
  orderBy, limit, where, serverTimestamp,
} from 'firebase/firestore';

/**
 * Labels lisibles pour l'affichage dans le dashboard admin.
 */
export const ACTION_LABELS = {
  'reservation.created':  'Réservation créée',
  'payment.initiated':    'Paiement initié',
  'payment.confirmed':    'Paiement confirmé',
  'payment.failed':       'Paiement échoué',
  'ticket.validated':     'Billet validé',
  'agency.approved':      'Agence approuvée',
  'agency.suspended':     'Agence suspendue',
  'agency.updated':       'Agence modifiée',
};

export const ACTION_COLORS = {
  'reservation.created':  'blue',
  'payment.initiated':    'yellow',
  'payment.confirmed':    'green',
  'payment.failed':       'red',
  'ticket.validated':     'purple',
  'agency.approved':      'green',
  'agency.suspended':     'red',
  'agency.updated':       'gray',
};

/**
 * Enregistre une action dans Firestore.
 * Fire-and-forget : les erreurs sont loguées en console mais ne bloquent jamais le flux principal.
 */
export function logActivity({ userId, agencyId, action, entityType, entityId, metadata } = {}) {
  addDoc(collection(db, 'activity_logs'), {
    userId:     userId     || null,
    agencyId:   agencyId   || null,
    action,
    entityType: entityType || null,
    entityId:   entityId   || null,
    metadata:   metadata   || null,
    createdAt:  serverTimestamp(),
  }).catch(err => console.warn('[activityLogs] log failed:', action, err.message));
}

/**
 * Récupère les derniers logs pour le dashboard admin.
 * @param {{ limitCount?: number, entityType?: string, action?: string }} opts
 */
export async function getActivityLogs({ limitCount = 100, entityType, action } = {}) {
  const constraints = [orderBy('createdAt', 'desc'), limit(limitCount)];
  if (entityType) constraints.unshift(where('entityType', '==', entityType));
  if (action)     constraints.unshift(where('action',     '==', action));

  const snap = await getDocs(query(collection(db, 'activity_logs'), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
