import { MessageCircle } from 'lucide-react';

const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_WHATSAPP || '24177000000';
const SUPPORT_MSG   = encodeURIComponent('Bonjour, j\'ai besoin d\'aide avec BusGabon.');

export default function WhatsAppSupport() {
  return (
    <a
      href={`https://wa.me/${SUPPORT_PHONE}?text=${SUPPORT_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter le support BusGabon sur WhatsApp"
      className="fixed bottom-6 right-4 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white pl-4 pr-5 py-3 rounded-full shadow-lg transition hover:shadow-xl group"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="text-sm font-semibold hidden sm:inline">Support</span>
    </a>
  );
}
