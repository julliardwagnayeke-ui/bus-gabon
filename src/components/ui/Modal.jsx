import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl w-full ${maxWidth} p-6 shadow-xl animate-scale-in`}>
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-dark text-lg">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
