'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';

const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin Agent',
    email: 'admin@agency.com',
    role: 'owner',
    status: 'active',
    lastLogin: '2 min ago',
  },
  {
    id: '2',
    name: 'Manager Agent',
    email: 'manager@agency.com',
    role: 'manager',
    status: 'active',
    lastLogin: '1h ago',
  },
];

export default function UsersPage() {
  const getRoleColor = (role: string) => {
    const colors: any = {
      owner: 'bg-danger/10 text-danger',
      manager: 'bg-primary/10 text-primary',
      checker: 'bg-success/10 text-success',
      finance: 'bg-warning/10 text-warning',
    };
    return colors[role] || 'bg-surface-alt text-text';
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-dark mb-2">Utilisateurs</h1>
                <p className="text-text-light">Gérez les accès de votre équipe</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold">
                <Plus className="w-4 h-4" /> Inviter
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-text-light">Nom</th>
                      <th className="text-left py-3 font-semibold text-text-light">Email</th>
                      <th className="text-left py-3 font-semibold text-text-light">Rôle</th>
                      <th className="text-left py-3 font-semibold text-text-light">Statut</th>
                      <th className="text-left py-3 font-semibold text-text-light">Dernier accès</th>
                      <th className="text-left py-3 font-semibold text-text-light">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-surface transition">
                        <td className="py-4 font-semibold text-dark">{user.name}</td>
                        <td className="py-4 text-text">{user.email}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            Actif
                          </span>
                        </td>
                        <td className="py-4 text-text-light text-xs">{user.lastLogin}</td>
                        <td className="py-4 flex gap-2">
                          <button className="p-2 hover:bg-surface rounded-lg transition text-primary">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-danger/10 rounded-lg transition text-danger">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
