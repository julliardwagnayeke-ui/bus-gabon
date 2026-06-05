// Villes du Gabon desservies (porté de l'app Vite). Utilisé pour les <select>.
export const CITIES = [
  'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda',
  'Lambaréné', 'Mouila', 'Tchibanga', 'Makokou', 'Koulamoutou',
  'Owendo', 'Ntoum', 'Bitam', 'Lastoursville', 'Mitzic',
  'Ndjolé', 'Kango', 'Fougamou', 'Okondja', 'Léconi',
  'Mimongo', 'Médouneu', 'Minvoul', 'Cocobeach',
] as const;

export const POPULAR_ROUTES = [
  { from: 'Libreville', to: 'Oyem' },
  { from: 'Libreville', to: 'Franceville' },
  { from: 'Libreville', to: 'Mouila' },
  { from: 'Libreville', to: 'Lambaréné' },
  { from: 'Libreville', to: 'Tchibanga' },
  { from: 'Franceville', to: 'Mouila' },
];
