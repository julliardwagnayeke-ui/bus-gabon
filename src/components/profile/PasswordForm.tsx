'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

interface PasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
}

export default function PasswordForm({ onSubmit }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Mot de passe actuel requis';
    }

    if (!formData.newPassword || formData.newPassword.length < 8) {
      newErrors.newPassword = 'Nouveau mot de passe requis (8 caractères minimum)';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <Input
          label="Mot de passe actuel"
          type={showPasswords.current ? 'text' : 'password'}
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          error={errors.currentPassword}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('current')}
          className="absolute right-3 top-9 text-text-light hover:text-text"
        >
          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Nouveau mot de passe"
          type={showPasswords.new ? 'text' : 'password'}
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          error={errors.newPassword}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('new')}
          className="absolute right-3 top-9 text-text-light hover:text-text"
        >
          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirmer le nouveau mot de passe"
          type={showPasswords.confirm ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('confirm')}
          className="absolute right-3 top-9 text-text-light hover:text-text"
        >
          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button type="submit" size="lg">
        Changer le mot de passe
      </Button>
    </form>
  );
}