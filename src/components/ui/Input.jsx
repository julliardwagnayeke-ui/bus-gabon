export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-dark">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-sm ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
