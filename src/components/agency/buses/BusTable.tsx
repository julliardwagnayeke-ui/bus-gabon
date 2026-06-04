'use client';

import { Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

interface Bus {
  id: string;
  name: string;
  licensePlate: string;
  capacity: number;
  type: string;
  status: 'active' | 'inactive' | 'maintenance' | 'archived';
  departureCount: number;
}

interface BusTableProps {
  buses: Bus[];
  onDelete: (id: string) => void;
}

export default function BusTable({ buses, onDelete }: BusTableProps) {
  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-surface-alt text-text',
      maintenance: 'bg-warning/10 text-warning',
      archived: 'bg-danger/10 text-danger',
    };
    return colors[status] || 'bg-surface-alt text-text';
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-dark">Mes bus ({buses.length})</h2>
        <Link
          href="/agency/buses/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
        >
          <Plus className="w-4 h-4" /> Ajouter un bus
        </Link>
      </div>

      {buses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-light mb-4">Aucun bus enregistré</p>
          <Link
            href="/agency/buses/new"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition font-semibold"
          >
            Ajouter votre premier bus
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-semibold text-text-light">Nom du bus</th>
                <th className="text-left py-3 font-semibold text-text-light">Immatriculation</th>
                <th className="text-left py-3 font-semibold text-text-light">Capacité</th>
                <th className="text-left py-3 font-semibold text-text-light">Type</th>
                <th className="text-left py-3 font-semibold text-text-light">Statut</th>
                <th className="text-left py-3 font-semibold text-text-light">Départs</th>
                <th className="text-left py-3 font-semibold text-text-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id} className="border-b border-border hover:bg-surface transition">
                  <td className="py-4 font-semibold text-dark">{bus.name}</td>
                  <td className="py-4 text-text">{bus.licensePlate}</td>
                  <td className="py-4 text-text font-semibold">{bus.capacity} places</td>
                  <td className="py-4 text-text capitalize">{bus.type}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bus.status)}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="py-4 text-text">{bus.departureCount}</td>
                  <td className="py-4 flex gap-2">
                    <Link
                      href={`/agency/buses/${bus.id}/edit`}
                      className="p-2 hover:bg-surface rounded-lg transition text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(bus.id)}
                      className="p-2 hover:bg-danger/10 rounded-lg transition text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
