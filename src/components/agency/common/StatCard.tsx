'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function StatCard({ icon, label, value, change, trend, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <p className="text-sm text-text-light mb-1">{label}</p>
      <p className="text-3xl font-bold text-dark">{value}</p>
    </div>
  );
}
