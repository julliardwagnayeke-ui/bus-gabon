'use client';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin mb-4"></div>
      <p className="text-text-light">Chargement en cours...</p>
    </div>
  );
}
