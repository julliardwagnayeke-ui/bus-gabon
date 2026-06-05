export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-border p-5 ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
