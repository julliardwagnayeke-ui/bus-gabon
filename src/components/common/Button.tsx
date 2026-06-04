import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary text-white hover:bg-primary-dark px-4 py-2 text-sm': variant === 'primary' && size === 'sm',
            'bg-primary text-white hover:bg-primary-dark px-6 py-3 text-base': variant === 'primary' && size === 'md',
            'bg-primary text-white hover:bg-primary-dark px-8 py-4 text-lg': variant === 'primary' && size === 'lg',
            'bg-secondary text-white hover:bg-secondary-dark': variant === 'secondary',
            'border border-border bg-white text-text hover:bg-surface-alt': variant === 'outline',
            'text-text hover:bg-surface-alt': variant === 'ghost',
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;