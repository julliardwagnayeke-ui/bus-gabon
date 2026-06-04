'use client';

import { Clock, MapPin, Users, AlertTriangle } from 'lucide-react';

interface TodayDeparture {
  id: string;
  route: string;
  time: string;
  bus: string;
  soldSeats: number;
  openSeats: number;
  status: string;
}

interface TodayDeparturesProps {
  departures: TodayDeparture[];
}

export default function TodayDepartures({ departures }: TodayDeparturesProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
        <Plane className="w-5 h-5" /> Départs du jour
      </h3>

      {departures.length === 0 ? (
        <p className="text-text-light text-center py-8">Aucun départ prévu aujourd'hui</p>
      ) : (
        <div className="space-y-3">
          {departures.map((dep) => (
            <div
              key={dep.id}
              className="flex items-start justify-between p-4 bg-surface rounded-lg hover:border hover:border-primary/30 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="font-semibold text-sm text-dark">{dep.route}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-light">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {dep.time}
                  </span>
                  <span>Bus : {dep.bus}</span>
                  <span className={`font-semibold ${dep.soldSeats > 20 ? 'text-danger' : 'text-success'}`}>
                    {dep.soldSeats}/{dep.openSeats} places
                  </span>
                </div>
              </div>
              <button className="px-3 py-2 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                Scanner
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
