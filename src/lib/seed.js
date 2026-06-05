/**
 * Données de démo — à importer manuellement dans Firestore (console Firebase)
 * ou via firebase-admin dans un script Node.
 *
 * Usage rapide : appelez seedDemoData() dans une page admin temporaire.
 */

import { db } from '../firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { format, addDays } from 'date-fns';

export async function seedDemoData() {
  console.log('🌱 Seeding demo data…');

  // ===== AGENCES =====
  const agencies = [
    {
      id: 'demo-agency-1',
      name: 'Transgabonaise Express',
      phone: '+241 077 11 22 33',
      email: 'contact@transgabonaise.ga',
      address: 'Gare routière de Libreville, PK5',
      description: 'Votre partenaire de confiance pour les trajets Libreville–Oyem depuis 2005.',
      status: 'active',
      verified: true,
      verifiedBadge: true,
      baggagePolicy: '1 bagage 20kg inclus. Supplémentaire : 2 000 FCFA.',
      cancellationPolicy: 'Non remboursable. Échange possible 24h avant départ.',
      openingHours: 'Lun–Sam 05h30–18h00',
    },
    {
      id: 'demo-agency-2',
      name: 'Sud Gabon Voyages',
      phone: '+241 066 44 55 66',
      email: 'info@sudgabon.ga',
      address: 'Terminal Mouila, Avenue de l\'Indépendance',
      description: 'Spécialiste des liaisons vers le sud du Gabon.',
      status: 'active',
      verified: true,
      verifiedBadge: true,
      baggagePolicy: '2 bagages 15kg inclus.',
      cancellationPolicy: 'Annulation possible jusqu\'à 6h avant le départ.',
      openingHours: 'Tous les jours 06h00–17h00',
    },
    {
      id: 'demo-agency-3',
      name: 'Oyem Direct',
      phone: '+241 074 77 88 99',
      email: 'oyemdirect@mail.ga',
      address: 'Gare routière PK12, Libreville',
      description: 'Express sans arrêt Libreville–Oyem en 6h30.',
      status: 'active',
      verified: true,
      verifiedBadge: true,
      baggagePolicy: '1 bagage 20kg inclus.',
      cancellationPolicy: 'Non remboursable.',
      openingHours: 'Lun–Dim 05h00–14h00',
    },
  ];

  for (const a of agencies) {
    const { id, ...data } = a;
    await setDoc(doc(db, 'agencies', id), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  // ===== BUS =====
  const buses = [
    { id: 'bus-1', agencyId: 'demo-agency-1', name: 'Sprinter A', plateNumber: 'GA-001-LBV', capacity: 20, status: 'active' },
    { id: 'bus-2', agencyId: 'demo-agency-1', name: 'Coaster B',  plateNumber: 'GA-002-LBV', capacity: 25, status: 'active' },
    { id: 'bus-3', agencyId: 'demo-agency-2', name: 'Bus SG-1',   plateNumber: 'GA-010-MGA', capacity: 30, status: 'active' },
    { id: 'bus-4', agencyId: 'demo-agency-3', name: 'Express OD', plateNumber: 'GA-020-LBV', capacity: 18, status: 'active' },
  ];
  for (const b of buses) {
    const { id, ...data } = b;
    await setDoc(doc(db, 'buses', id), { ...data, createdAt: serverTimestamp() });
  }

  // ===== ROUTES =====
  const routes = [
    { id: 'route-1', agencyId: 'demo-agency-1', originCity: 'Libreville', destinationCity: 'Oyem',        basePrice: 15000, estimatedDuration: 480, baggageIncluded: 1, baggageMaxWeight: 20, baggageExtraFee: 2000, cancellationPolicy: 'Non remboursable', status: 'active' },
    { id: 'route-2', agencyId: 'demo-agency-1', originCity: 'Libreville', destinationCity: 'Bitam',       basePrice: 18000, estimatedDuration: 540, baggageIncluded: 1, baggageMaxWeight: 20, baggageExtraFee: 2000, cancellationPolicy: 'Non remboursable', status: 'active' },
    { id: 'route-3', agencyId: 'demo-agency-2', originCity: 'Libreville', destinationCity: 'Mouila',      basePrice: 12000, estimatedDuration: 360, baggageIncluded: 2, baggageMaxWeight: 15, baggageExtraFee: 1500, cancellationPolicy: 'Annulable 6h avant', status: 'active' },
    { id: 'route-4', agencyId: 'demo-agency-2', originCity: 'Libreville', destinationCity: 'Tchibanga',   basePrice: 14000, estimatedDuration: 420, baggageIncluded: 2, baggageMaxWeight: 15, baggageExtraFee: 1500, cancellationPolicy: 'Annulable 6h avant', status: 'active' },
    { id: 'route-5', agencyId: 'demo-agency-3', originCity: 'Libreville', destinationCity: 'Oyem',        basePrice: 16000, estimatedDuration: 390, baggageIncluded: 1, baggageMaxWeight: 20, baggageExtraFee: 2000, cancellationPolicy: 'Non remboursable', status: 'active' },
    { id: 'route-6', agencyId: 'demo-agency-1', originCity: 'Libreville', destinationCity: 'Franceville', basePrice: 20000, estimatedDuration: 600, baggageIncluded: 1, baggageMaxWeight: 20, baggageExtraFee: 3000, cancellationPolicy: 'Non remboursable', status: 'active' },
  ];
  for (const r of routes) {
    const { id, ...data } = r;
    await setDoc(doc(db, 'routes', id), { ...data, createdAt: serverTimestamp() });
  }

  // ===== DÉPARTS (7 prochains jours) =====
  const departures = [];
  for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
    const d = format(addDays(new Date(), dayOffset), 'yyyy-MM-dd');
    departures.push(
      { routeId: 'route-1', busId: 'bus-1', agencyId: 'demo-agency-1', departureDate: d, departureTime: '07:00', estimatedArrivalTime: '15:00', totalSeats: 20, maxTicketsPerOrder: 4, status: 'scheduled', originCity: 'Libreville', destinationCity: 'Oyem' },
      { routeId: 'route-3', busId: 'bus-3', agencyId: 'demo-agency-2', departureDate: d, departureTime: '08:30', estimatedArrivalTime: '14:30', totalSeats: 30, maxTicketsPerOrder: 4, status: 'scheduled', originCity: 'Libreville', destinationCity: 'Mouila' },
      { routeId: 'route-5', busId: 'bus-4', agencyId: 'demo-agency-3', departureDate: d, departureTime: '06:30', estimatedArrivalTime: '13:00', totalSeats: 18, maxTicketsPerOrder: 4, status: 'scheduled', originCity: 'Libreville', destinationCity: 'Oyem' },
    );
  }
  for (const dep of departures) {
    await addDoc(collection(db, 'departures'), { ...dep, createdAt: serverTimestamp() });
  }

  // ===== UTILISATEURS DEMO =====
  const demoUsers = [
    { id: 'demo-client-1',  name: 'Jean Mouketou',          email: 'client@demo.ga',  phone: '077123456', role: 'client' },
    { id: 'demo-agency-u1', name: 'Transgabonaise Express', email: 'agence@demo.ga',  phone: '077112233', role: 'agency_admin', agencyId: 'demo-agency-1' },
    { id: 'demo-admin-1',   name: 'Admin BusGabon',         email: 'admin@demo.ga',   phone: '077000000', role: 'platform_admin' },
  ];
  for (const u of demoUsers) {
    const { id, ...data } = u;
    await setDoc(doc(db, 'users', id), { ...data, createdAt: serverTimestamp() });
  }

  console.log('✅ Seed terminé !');
}
