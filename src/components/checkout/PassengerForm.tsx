'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { formValidators } from '@/lib/validators';

interface PassengerFormProps {
  passengerCount: number;
  onSubmit: (data: any) => void;
}

export default function PassengerForm({ passengerCount, onSubmit }: PassengerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    passengers: Array(passengerCount).fill(null).map(() => ({
      name: '',
      phone: '',
    })),
  });
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!formValidators.required(formData.contactName)) {
      newErrors.contactName = 'Le nom est requis';
    }

    if (!formValidators.required(formData.contactPhone) || !formValidators.phone(formData.contactPhone)) {
      newErrors.contactPhone = 'Numéro de téléphone valide requis';
    }

    if (!formValidators.required(formData.contactEmail) || !formValidators.email(formData.contactEmail)) {
      newErrors.contactEmail = 'Email valide requis';
    }

    formData.passengers.forEach((passenger, index) => {
      if (!formValidators.required(passenger.name)) {
        newErrors[`passenger_${index}_name`] = 'Le nom est requis';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updatePassenger = (index: number, field: string, value: string) => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setFormData({ ...formData, passengers: newPassengers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact principal */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-xl font-bold text-dark mb-6">Informations du contact</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            error={errors.contactName}
            required
          />

          <Input
            label="Téléphone WhatsApp"
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            error={errors.contactPhone}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            error={errors.contactEmail}
            required
          />
        </div>
      </div>

      {/* Passagers */}
      {passengerCount > 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-xl font-bold text-dark mb-6">Informations des passagers</h3>

          <div className="space-y-6">
            {formData.passengers.map((passenger, index) => (
              <div key={index} className="border border-border rounded-xl p-4">
                <h4 className="font-semibold text-dark mb-4">Passager {index + 1}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                    error={errors[`passenger_${index}_name`]}
                    required
                  />

                  <Input
                    label="Téléphone (optionnel)"
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continuer vers le paiement
        </Button>
      </div>
    </form>
  );
}