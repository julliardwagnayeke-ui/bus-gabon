import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import { User } from 'lucide-react';

export default function Profile() {
  const { user } = useApp();
  const [form, setForm]     = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.uid) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { name: form.name, phone: form.phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.warn('[Profile] save failed', err); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Mon profil</h1>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-dark">{user?.name || 'Utilisateur'}</p>
        <p className="text-text-light text-sm">{user?.email}</p>
        <span className="mt-2 px-3 py-1 bg-primary-50 text-primary text-xs font-semibold rounded-full capitalize">
          {user?.role || 'client'}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Nom complet</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Téléphone</label>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
            placeholder="+241 XX XX XX XX"
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Email</label>
          <input value={user?.email || ''} disabled
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface-alt text-text-muted text-sm" />
        </div>

        {saved && <p className="text-success text-sm">Profil mis à jour ✓</p>}
        <Button type="submit" loading={loading} className="w-full">Enregistrer</Button>
      </form>
    </div>
  );
}
