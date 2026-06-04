'use client';

import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AlertBoxProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

export default function AlertBox({ type, title, message, onClose }: AlertBoxProps) {
  const styles = {
    success: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', icon: CheckCircle },
    error: { bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger', icon: AlertCircle },
    warning: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: AlertTriangle },
    info: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: Info },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex gap-3`}>
      <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>
        <p className="text-sm text-text-light">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className={`${style.text} hover:opacity-70 transition`}>
          ✕
        </button>
      )}
    </div>
  );
}
