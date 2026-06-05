import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, User } from 'lucide-react';
import BaggagePolicy from '../booking/BaggagePolicy';

const STATUS_LABELS = {
  paid:            { label: 'PAYÉ',    color: 'bg-green-100 text-green-800' },
  used:            { label: 'UTILISÉ', color: 'bg-gray-100 text-gray-700' },
  cancelled:       { label: 'ANNULÉ',  color: 'bg-red-100 text-red-800' },
  expired:         { label: 'EXPIRÉ',  color: 'bg-amber-100 text-amber-800' },
  pending_payment: { label: 'EN ATTENTE', color: 'bg-blue-100 text-blue-800' },
};

export default function BusTicketQR({ ticket, departure, agency, route }) {
  const statusInfo = STATUS_LABELS[ticket?.status] || STATUS_LABELS.paid;
  const isPaid = ticket?.status === 'paid';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border card-float max-w-sm mx-auto">
      {/* Header gradient */}
      <div className="gradient-primary px-5 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium opacity-80 mb-0.5">BusGabon</p>
            <p className="font-bold text-lg">{route?.originCity} → {route?.destinationCity}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Ticket body */}
      <div className="px-5 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-text-muted text-xs mb-0.5">Agence</p>
            <p className="font-semibold text-dark">{agency?.name || '—'}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-0.5">Date</p>
            <p className="font-semibold text-dark">
              {departure?.departureDate
                ? format(new Date(departure.departureDate), 'dd MMM yyyy', { locale: fr })
                : '—'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <div>
              <p className="text-text-muted text-xs mb-0.5">Départ</p>
              <p className="font-semibold text-dark">{departure?.departureTime || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-primary" />
            <div>
              <p className="text-text-muted text-xs mb-0.5">Passager</p>
              <p className="font-semibold text-dark text-xs">{ticket?.passengerName || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tiret */}
      <div className="flex items-center mx-5 my-1">
        <div className="flex-1 border-t-2 border-dashed border-border" />
        <div className="w-4 h-4 rounded-full bg-surface-alt border border-border mx-2" />
        <div className="flex-1 border-t-2 border-dashed border-border" />
      </div>

      {/* QR code */}
      <div className="flex flex-col items-center py-5 px-5">
        {isPaid ? (
          <>
            <div className="p-3 bg-white rounded-xl border border-border shadow-sm mb-3">
              <QRCodeSVG
                value={ticket?.qrPayload || ticket?.publicCode || 'INVALID'}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-xs font-mono text-text-light tracking-widest">{ticket?.publicCode}</p>
          </>
        ) : (
          <div className="w-40 h-40 bg-surface-alt rounded-xl flex items-center justify-center border border-border">
            <span className="text-text-muted text-xs text-center px-4">QR disponible après paiement</span>
          </div>
        )}
      </div>

      {/* Bagages compact */}
      {route && (
        <div className="px-5 pb-3">
          <BaggagePolicy route={route} compact />
        </div>
      )}

      {/* Footer */}
      <div className="bg-surface-alt px-5 py-3 text-center">
        <p className="text-xs text-text-muted">Présentez ce billet au départ · Billet usage unique</p>
      </div>
    </div>
  );
}
