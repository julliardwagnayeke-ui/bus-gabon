import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const SETTINGS_DEFAULTS = {
  commissionRate:            0.05,  // 5%
  serviceFee:                200,   // FCFA
  reservationExpiryMinutes:  10,    // minutes
};

const ref = () => doc(db, 'settings', 'platform');

export async function getSettings() {
  try {
    const snap = await getDoc(ref());
    return snap.exists()
      ? { ...SETTINGS_DEFAULTS, ...snap.data() }
      : { ...SETTINGS_DEFAULTS };
  } catch {
    return { ...SETTINGS_DEFAULTS };
  }
}

export async function updateSettings(data) {
  const allowed = {};
  if (typeof data.commissionRate           === 'number') allowed.commissionRate           = data.commissionRate;
  if (typeof data.serviceFee               === 'number') allowed.serviceFee               = data.serviceFee;
  if (typeof data.reservationExpiryMinutes === 'number') allowed.reservationExpiryMinutes = data.reservationExpiryMinutes;

  await setDoc(ref(), { ...allowed, updatedAt: serverTimestamp() }, { merge: true });
}
