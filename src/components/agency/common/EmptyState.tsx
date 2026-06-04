'use client';

export default function EmptyState({ icon, title, description, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-2xl border-2 border-dashed border-border">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
      <p className="text-sm text-text-light mb-8 max-w-md text-center">{description}</p>
      {action && (
        <button className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition">
          {action.label}
        </button>
      )}
    </div>
  );
}
