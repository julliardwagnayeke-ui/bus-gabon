import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getReservation } from '../../services/reservations';
import { getReservationTickets } from '../../services/tickets';
import { getDeparture } from '../../services/departures';
import { getAgency } from '../../services/agencies';
import { buildWhatsAppLink, buildTicketWhatsAppMessage } from '../../services/notifications';
import BusTicketQR from '../../components/tickets/BusTicketQR';
import Spinner from '../../components/ui/Spinner';
import { useApp } from '../../context/AppContext';

export default function TicketDetail() {
  const { ticketId } = useParams();
  const { user } = useApp();

  const [reservation, setReservation] = useState(null);
  const [tickets,     setTickets]     = useState([]);
  const [departure,   setDeparture]   = useState(null);
  const [agency,      setAgency]      = useState(null);
  const [route,       setRoute]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [activeIdx,   setActiveIdx]   = useState(0);

  useEffect(() => {
    setLoading(true);
    getReservation(ticketId)
      .then(async (res) => {
        if (!res) return;
        setReservation(res);
        const [tks, dep, ag] = await Promise.all([
          getReservationTickets(res.id),
          getDeparture(res.departureId),
          getAgency(res.agencyId),
        ]);
        setTickets(tks);
        setDeparture(dep);
        setRoute(dep?.route || null);
        setAgency(ag);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!reservation) return (
    <div className="text-center py-20">
      <p className="text-text-light mb-4">Billet introuvable.</p>
      <Link to="/mes-billets" className="text-primary hover:underline text-sm">Mes billets</Link>
    </div>
  );

  const ticket = tickets[activeIdx];
  let formattedDate = departure?.departureDate || '';
  try { formattedDate = format(new Date(departure.departureDate), 'd MMMM yyyy', { locale: fr }); }
  catch (err) { console.warn('[TicketDetail] date format failed', err); }

  const whatsappLink = ticket ? buildWhatsAppLink(user?.phone || '', buildTicketWhatsAppMessage({
    passengerName: ticket.passengerName,
    route: `${route?.originCity} → ${route?.destinationCity}`,
    date: formattedDate,
    time: departure?.departureTime,
    publicCode: ticket.publicCode,
  })) : '#';

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Link to="/mes-billets" className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-dark mb-6">
        <ArrowLeft className="w-4 h-4" /> Mes billets
      </Link>

      <h1 className="text-xl font-bold text-dark mb-6">
        {route?.originCity || '?'} → {route?.destinationCity || '?'}
      </h1>

      {/* Sélecteur si plusieurs billets */}
      {tickets.length > 1 && (
        <div className="flex gap-2 mb-5">
          {tickets.map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeIdx === i ? 'bg-primary text-white' : 'bg-surface-alt text-text-light'}`}>
              Billet {i + 1}
            </button>
          ))}
        </div>
      )}

      {ticket ? (
        <>
          <BusTicketQR ticket={ticket} departure={departure} agency={agency} route={route} />

          <div className="mt-5 space-y-3">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white rounded-full font-semibold text-sm hover:bg-green-600 transition">
              <Share2 className="w-5 h-5" /> Partager sur WhatsApp
            </a>
          </div>
        </>
      ) : (
        <p className="text-center text-text-muted text-sm py-10">Aucun billet généré pour cette réservation.</p>
      )}
    </div>
  );
}
