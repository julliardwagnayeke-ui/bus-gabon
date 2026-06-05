export function buildWhatsAppLink(phone, message) {
  const clean = phone.replace(/\s+/g, '').replace(/^\+/, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildTicketWhatsAppMessage({ passengerName, route, date, time, publicCode }) {
  return `🚌 *BusGabon — Votre billet est confirmé !*

Passager : ${passengerName}
Trajet : ${route}
Date : ${date}
Départ : ${time}
Code : *${publicCode}*

Présentez ce code ou le QR code à l'agence au moment du départ.
Bon voyage !`;
}

export function buildReminderMessage({ passengerName, route, date, time }) {
  return `🔔 *Rappel BusGabon*

Bonjour ${passengerName},
Votre départ *${route}* est prévu demain, ${date} à ${time}.

Présentez-vous à l'agence 15 min avant le départ.`;
}
