'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Button from '@/components/common/Button';

interface TermsCheckboxProps {
  onAccept: (accepted: boolean) => void;
  accepted: boolean;
}

export default function TermsCheckbox({ onAccept, accepted }: TermsCheckboxProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onAccept(!accepted)}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            accepted
              ? 'bg-primary border-primary text-white'
              : 'border-border hover:border-primary'
          }`}
        >
          {accepted && <Check className="w-4 h-4" />}
        </button>

        <div className="text-sm">
          <p className="text-text mb-2">
            J'accepte les{' '}
            <button className="text-primary hover:underline">
              conditions générales de vente
            </button>
            {' '}et la{' '}
            <button className="text-primary hover:underline">
              politique de confidentialité
            </button>
            .
          </p>
          <p className="text-text-light">
            Je confirme avoir lu et compris les conditions d'annulation et de modification de réservation.
          </p>
        </div>
      </div>
    </div>
  );
}