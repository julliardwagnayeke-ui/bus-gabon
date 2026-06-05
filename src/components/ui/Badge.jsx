export default function Badge({ color = 'blue', children, className = '' }) {
  const colors = {
    blue:   'bg-blue-100 text-blue-800',
    green:  'bg-green-100 text-green-800',
    gray:   'bg-gray-100 text-gray-700',
    red:    'bg-red-100 text-red-800',
    amber:  'bg-amber-100 text-amber-800',
    purple: 'bg-purple-100 text-purple-800',
    primary:'bg-primary-50 text-primary',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors[color] || colors.blue} ${className}`}>
      {children}
    </span>
  );
}
