import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Villes du Gabon par province (chefs-lieux + principales villes desservies par bus)
const CITIES: Array<{ name: string; province: string }> = [
  // Estuaire
  { name: 'Libreville', province: 'Estuaire' },
  { name: 'Ntoum', province: 'Estuaire' },
  { name: 'Kango', province: 'Estuaire' },
  { name: 'Cocobeach', province: 'Estuaire' },
  // Haut-Ogooué
  { name: 'Franceville', province: 'Haut-Ogooué' },
  { name: 'Moanda', province: 'Haut-Ogooué' },
  { name: 'Okondja', province: 'Haut-Ogooué' },
  { name: 'Lékoni', province: 'Haut-Ogooué' },
  // Moyen-Ogooué
  { name: 'Lambaréné', province: 'Moyen-Ogooué' },
  { name: 'Ndjolé', province: 'Moyen-Ogooué' },
  // Ngounié
  { name: 'Mouila', province: 'Ngounié' },
  { name: 'Fougamou', province: 'Ngounié' },
  { name: 'Ndendé', province: 'Ngounié' },
  // Nyanga
  { name: 'Tchibanga', province: 'Nyanga' },
  { name: 'Mayumba', province: 'Nyanga' },
  // Ogooué-Ivindo
  { name: 'Makokou', province: 'Ogooué-Ivindo' },
  { name: 'Booué', province: 'Ogooué-Ivindo' },
  { name: 'Mékambo', province: 'Ogooué-Ivindo' },
  // Ogooué-Lolo
  { name: 'Koulamoutou', province: 'Ogooué-Lolo' },
  { name: 'Lastoursville', province: 'Ogooué-Lolo' },
  // Ogooué-Maritime
  { name: 'Port-Gentil', province: 'Ogooué-Maritime' },
  { name: 'Gamba', province: 'Ogooué-Maritime' },
  { name: 'Omboué', province: 'Ogooué-Maritime' },
  // Woleu-Ntem
  { name: 'Oyem', province: 'Woleu-Ntem' },
  { name: 'Bitam', province: 'Woleu-Ntem' },
  { name: 'Mitzic', province: 'Woleu-Ntem' },
  { name: 'Minvoul', province: 'Woleu-Ntem' },
];

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('🌱 Seed — villes du Gabon');
  for (const c of CITIES) {
    await prisma.city.upsert({
      where: { name: c.name },
      update: { province: c.province, slug: slugify(c.name) },
      create: { name: c.name, province: c.province, slug: slugify(c.name) },
    });
  }
  console.log(`   → ${CITIES.length} villes`);

  console.log('🌱 Seed — réglages plateforme (singleton)');
  await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      commissionPercentage: 5,
      userFeePerTicket: 200,
      currency: 'XAF',
      reservationBlockTime: 10,
      maxTicketsPerBooking: 4,
    },
  });

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
