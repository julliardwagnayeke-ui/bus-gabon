import Badge from '@/components/common/Badge';

interface TicketStatusBadgeProps {
  status: 'valid' | 'used' | 'cancelled' | 'expired';
}

export default function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const statusConfig = {
    valid: { variant: 'success' as const, label: 'Valide' },
    used: { variant: 'warning' as const, label: 'Utilisé' },
    cancelled: { variant: 'error' as const, label: 'Annulé' },
    expired: { variant: 'error' as const, label: 'Expiré' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}