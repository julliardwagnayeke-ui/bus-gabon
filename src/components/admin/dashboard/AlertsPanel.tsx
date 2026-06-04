'use client';

import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AdminAlert } from '@/types/admin';

interface AlertsPanelProps {
  alerts: AdminAlert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Alertes importantes</h2>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">Aucune alerte critique</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 border rounded-lg ${getSeverityBg(alert.severity)}`}
            >
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900">{alert.title}</p>
                <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
