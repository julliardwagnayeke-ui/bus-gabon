'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, LogOut } from 'lucide-react';
import Button from '@/components/common/Button';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordForm from '@/components/profile/PasswordForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.get('/api/me').then(res => res.data),
  });

  const handleProfileUpdate = async (data: any) => {
    try {
      await api.patch('/api/me', data);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handlePasswordUpdate = async (data: any) => {
    try {
      await api.patch('/api/me/password', data);
      alert('Mot de passe mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Mon profil</h1>
          <p className="text-text-light">
            Gérez vos informations personnelles et votre compte
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm border border-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'text-text-light hover:text-text'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'password'
                ? 'bg-primary text-white'
                : 'text-text-light hover:text-text'
            }`}
          >
            Mot de passe
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          {activeTab === 'profile' ? (
            <ProfileForm
              initialData={user}
              onSubmit={handleProfileUpdate}
            />
          ) : (
            <PasswordForm onSubmit={handlePasswordUpdate} />
          )}
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}