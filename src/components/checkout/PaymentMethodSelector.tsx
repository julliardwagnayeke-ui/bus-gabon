'use client';

import { useState } from 'react';
import { Smartphone, CreditCard } from 'lucide-react';
import Button from '@/components/common/Button';

interface PaymentMethodSelectorProps {
  onSelect: (method: 'airtel' | 'moov' | 'card') => void;
  selectedMethod?: 'airtel' | 'moov' | 'card';
}

export default function PaymentMethodSelector({ onSelect, selectedMethod }: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'airtel' as const,
      name: 'Airtel Money',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Paiement mobile Airtel',
      color: 'bg-red-500',
    },
    {
      id: 'moov' as const,
      name: 'Moov Money',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Paiement mobile Moov',
      color: 'bg-orange-500',
    },
    {
      id: 'card' as const,
      name: 'Carte bancaire',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard (bientôt)',
      color: 'bg-blue-500',
      disabled: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-dark">Choisir un moyen de paiement</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => !method.disabled && onSelect(method.id)}
            disabled={method.disabled}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedMethod === method.id
                ? 'border-primary bg-primary/5'
                : method.disabled
                ? 'border-border bg-surface-alt opacity-50 cursor-not-allowed'
                : 'border-border bg-white hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${method.color} text-white rounded-lg flex items-center justify-center`}>
                {method.icon}
              </div>
              <div>
                <div className="font-semibold text-dark">{method.name}</div>
                <div className="text-sm text-text-light">{method.description}</div>
              </div>
            </div>
            {method.disabled && (
              <div className="text-xs text-orange-600 mt-2">Bientôt disponible</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}