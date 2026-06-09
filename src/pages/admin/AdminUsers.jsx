import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/profiles';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { format } from 'date-fns';

const ROLE_COLOR = {
  client: 'blue',
  super_admin: 'red', finance_admin: 'red', support_admin: 'red',
  operations_admin: 'red', content_admin: 'red',
};

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Utilisateurs ({users.length})</h1>
      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Nom</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Email</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Rôle</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-border hover:bg-surface-alt">
                  <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-text-light">{u.email}</td>
                  <td className="px-4 py-3"><Badge color={ROLE_COLOR[u.role] || 'gray'}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-text-muted text-xs">
                    {u.createdAt ? format(new Date(u.createdAt), 'dd/MM/yyyy') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
