import Button from '@/components/common/Button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppShareButtonProps {
  ticketId: string;
  message?: string;
  onShare?: () => void;
}

export default function WhatsAppShareButton({ ticketId, message, onShare }: WhatsAppShareButtonProps) {
  const handleShare = () => {
    const defaultMessage = `Voici mon billet BusGabon - Code: ${ticketId}`;
    const shareMessage = message || defaultMessage;
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
    onShare?.();
  };

  return (
    <Button onClick={handleShare} variant="outline">
      <MessageCircle className="w-4 h-4 mr-2" />
      Partager WhatsApp
    </Button>
  );
}