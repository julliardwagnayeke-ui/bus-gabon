import { validators } from '@/lib/api';

export const formValidators = {
  ...validators,
  name: (name: string) => name.trim().length >= 2,
  passengers: (count: number) => count >= 1 && count <= 4,
};