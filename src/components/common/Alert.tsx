import { cn } from '@/lib/utils';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export default function Alert({ children, variant = 'info', className }: AlertProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border',
        {
          'bg-blue-50 border-blue-200 text-blue-800': variant === 'info',
          'bg-green-50 border-green-200 text-green-800': variant === 'success',
          'bg-yellow-50 border-yellow-200 text-yellow-800': variant === 'warning',
          'bg-red-50 border-red-200 text-red-800': variant === 'error',
        },
        className
      )}
    >
      {children}
    </div>
  );
}