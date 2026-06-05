import { formatPrice } from '../../lib/pricing';

export default function BarChart({ items = [], color = '#0068C8' }) {
  if (!items.length) {
    return <p className="text-xs text-text-muted">Aucune donnée à afficher.</p>;
  }
  const max = Math.max(...items.map(i => i.value), 1);

  return (
    <ul className="space-y-3" role="list">
      {items.map((it, idx) => {
        const pct = Math.max(2, Math.round((it.value / max) * 100));
        return (
          <li key={idx} className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-dark truncate pr-2">{it.label}</span>
              <span className="text-text-light text-xs flex-shrink-0">{formatPrice(it.value)}</span>
            </div>
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
                role="progressbar"
                aria-valuenow={it.value}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={`${it.label} : ${formatPrice(it.value)}`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
