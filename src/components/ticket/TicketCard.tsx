'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Clock, User, QrCode as QrIcon, Download, Share2, Phone, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/lib/api';
import { Ticket } from '@/types/user';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log('Download ticket');
  };

  const handleShareWhatsApp = () => {
    const message = `Mon billet BusGabon: ${ticket.departure.originCity} → ${ticket.departure.destinationCity} le ${formatDate(ticket.departure.date)} à ${ticket.departure.time}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleContactAgency = () => {
    window.open(`tel:${ticket.departure.agency.phone}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">BusGabon</h1>
          <Badge variant={ticket.status === 'valid' ? 'success' : 'error'}>
            {ticket.status === 'valid' ? 'Valide' : 'Invalide'}
          </Badge>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{ticket.id}</div>
          <div className="text-white/80">Code de réservation</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Route */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark">{ticket.departure.originCity}</div>
            <div className="text-text-light">Départ</div>
          </div>
          <div className="flex-1 mx-4 relative">
            <div className="h-0.5 bg-border"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-dark">{ticket.departure.destinationCity}</div>
            <div className="text-text-light">Arrivée</div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-text-light mb-1">Date & Heure</div>
            <div className="font-semibold text-dark">
              {formatDate(ticket.departure.date)} à {ticket.departure.time}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-light mb-1">Agence</div>
            <div className="font-semibold text-dark">{ticket.departure.agency.name}</div>
          </div>
          <div>
            <div className="text-sm text-text-light mb-1">Passager</div>
            <div className="font-semibold text-dark">{ticket.passengerName}</div>
          </div>
          <div>
            <div className="text-sm text-text-light mb-1">Prix payé</div>
            <div className="font-semibold text-dark">{formatCurrency(ticket.departure.price)}</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-surface-alt rounded-xl">
            <QRCodeSVG value={ticket.qrCode} size={120} />
          </div>
          <p className="text-sm text-text-light mt-2">
            Présentez ce QR code à l'agence
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </Button>

          <Button onClick={handleShareWhatsApp} variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            WhatsApp
          </Button>

          <Button onClick={handleContactAgency} variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Agence
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Support
          </Button>
        </div>
      </div>
    </div>
  );
}