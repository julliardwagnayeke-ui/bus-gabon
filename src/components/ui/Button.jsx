export default function Button({ variant = 'primary', size = 'md', loading = false, children, className = '', ...props }) {
  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-dark shadow-sm',
    secondary: 'bg-dark text-white hover:opacity-90 shadow-sm',
    outline:   'border-2 border-primary text-primary hover:bg-primary-50',
    ghost:     'text-text-light hover:bg-gray-100',
    danger:    'bg-danger text-white hover:opacity-90',
    success:   'bg-success text-white hover:opacity-90',
    accent:    'bg-accent text-white hover:bg-accent-dark shadow-sm',
  };
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-sm',
    xl: 'px-10 py-4 text-base',
  };
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Chargement...
        </>
      ) : children}
    </button>
  );
}
