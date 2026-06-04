// Validateurs de base (email, téléphone gabonais, champ requis).
const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  // Numéros gabonais : 9 chiffres (Airtel/Moov), avec indicatif +241 optionnel.
  phone: (value: string) => /^(\+?241)?\s?0?[0-9]{8,9}$/.test(value.replace(/\s/g, '')),
  required: (value: string) => value.trim().length > 0,
};

export const formValidators = {
  ...validators,
  name: (name: string) => name.trim().length >= 2,
  passengers: (count: number) => count >= 1 && count <= 4,
};