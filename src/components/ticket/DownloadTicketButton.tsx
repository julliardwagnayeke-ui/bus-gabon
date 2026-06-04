import Button from '@/components/common/Button';
import { Download } from 'lucide-react';

interface DownloadTicketButtonProps {
  ticketId: string;
  onDownload?: () => void;
}

export default function DownloadTicketButton({ ticketId, onDownload }: DownloadTicketButtonProps) {
  const handleDownload = () => {
    // TODO: Implement PDF download
    onDownload?.();
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Télécharger PDF
    </Button>
  );
}