import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, query,
  where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { generatePublicCode, buildQrPayload, parseQrPayload } from '../lib/ticketCode';

export async function generateTicketsForReservation(reservation) {
  const { id: reservationId, departureId, agencyId, userId, passengerName, ticketCount } = reservation;
  const ticketIds = [];

  for (let i = 0; i < ticketCount; i++) {
    const publicCode = generatePublicCode();
    const ticketRef = doc(collection(db, 'tickets'));
    const qrPayload = buildQrPayload(ticketRef.id, publicCode);
    await addDoc(collection(db, 'tickets'), {
      id: ticketRef.id,
      reservationId,
      departureId,
      agencyId,
      userId,
      passengerName,
      ticketIndex: i + 1,
      publicCode,
      qrPayload,
      status: 'paid',
      createdAt: serverTimestamp(),
    });
    ticketIds.push(ticketRef.id);
  }

  // Mettre à jour la réservation → paid
  await updateDoc(doc(db, 'reservations', reservationId), {
    status: 'paid',
    paidAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ticketIds;
}

export async function getUserTickets(userId) {
  const snap = await getDocs(query(
    collection(db, 'tickets'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTicket(id) {
  const snap = await getDoc(doc(db, 'tickets', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getReservationTickets(reservationId) {
  const snap = await getDocs(query(collection(db, 'tickets'), where('reservationId', '==', reservationId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function verifyTicket(payload, agencyId = null, markAsUsed = false) {
  const parsed = parseQrPayload(payload);
  const code = parsed.code || payload;

  // Chercher par publicCode
  const snap = await getDocs(query(collection(db, 'tickets'), where('publicCode', '==', code)));

  if (snap.empty) {
    return { valid: false, message: 'Billet introuvable. Code invalide.' };
  }

  const ticketDoc = snap.docs[0];
  const ticket = { id: ticketDoc.id, ...ticketDoc.data() };

  if (ticket.status === 'used') {
    return { valid: false, alreadyUsed: true, message: 'Ce billet a déjà été utilisé.', ticket: ticketInfo(ticket) };
  }
  if (ticket.status === 'cancelled') {
    return { valid: false, message: 'Ce billet a été annulé.' };
  }
  if (ticket.status === 'expired') {
    return { valid: false, message: 'Ce billet est expiré.' };
  }
  if (ticket.status !== 'paid') {
    return { valid: false, message: 'Ce billet n\'est pas valide (statut : ' + ticket.status + ').' };
  }

  if (markAsUsed) {
    await updateDoc(ticketDoc.ref, { status: 'used', validatedAt: serverTimestamp(), validatedBy: agencyId || 'manual' });
    // Enregistrer dans ticket_checks
    await addDoc(collection(db, 'ticket_checks'), {
      ticketId: ticket.id,
      checkedBy: agencyId || 'manual',
      agencyId: ticket.agencyId,
      result: 'valid',
      checkedAt: serverTimestamp(),
    });
  }

  return { valid: true, message: 'Billet valide. Bon voyage !', ticket: ticketInfo(ticket) };
}

export async function verifyTicketPublic(payload) {
  return verifyTicket(payload, null, false);
}

function ticketInfo(ticket) {
  return {
    passengerName: ticket.passengerName,
    route: ticket.route || '—',
    departureDate: ticket.departureDate || '—',
    departureTime: ticket.departureTime || '—',
    publicCode: ticket.publicCode,
    status: ticket.status,
  };
}
