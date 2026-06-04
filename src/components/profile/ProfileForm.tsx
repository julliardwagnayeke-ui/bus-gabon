'use client';

import { useState } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { formValidators } from '@/lib/validators';

interface ProfileFormProps {
  initialData?: {
    name: string;
    email: string;
    phone: string;
  };
  onSubmit: (data: any) => void;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!formValidators.required(formData.name) || !formValidators.name(formData.name)) {
      newErrors.name = 'Nom complet requis';
    }

    if (!formValidators.required(formData.email) || !formValidators.email(formData.email)) {
      newErrors.email = 'Email valide requis';
    }

    if (!formValidators.required(formData.phone) || !formValidators.phone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone valide requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nom complet"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <Input
        label="Téléphone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
        required
      />

      <Button type="submit" size="lg">
        Mettre à jour le profil
      </Button>
    </form>
  );
}