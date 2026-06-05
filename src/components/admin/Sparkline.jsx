export default function Sparkline({
  data = [],
  width = 320,
  height = 80,
  color = '#0068C8',
  fill = 'rgba(0,104,200,0.12)',
  ariaLabel = 'Tendance',
}) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-xs text-text-muted" style={{ width, height }}>
        Aucune donnée
      </div>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return [x, y];
  });

  const pathLine = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const pathArea = `${pathLine} L${width},${height} L0,${height} Z`;

  const last = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className="overflow-visible"
    >
      <path d={pathArea} fill={fill} />
      <path d={pathLine} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="6.5" fill={color} opacity="0.18" />
    </svg>
  );
}
