'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMyTickets } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import Spinner from '@/components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, MapPin, Calendar, Clock, QrCode as QrIcon, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

export default function MyTicketsPage() {
  const { user, authLoading } = useApp();
  const router = useRouter();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: fetchMyTickets,
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push('/connexion');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TicketIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Mes Billets</h1>
      </div>

      {!tickets || tickets.length === 0 ? (
        <div className="text-center py-20 bg-surface-alt rounded-[2.5rem] border border-dashed border-border">
          <p className="text-5xl mb-4">🎫</p>
          <h2 className="font-bold text-dark text-lg">Vous n'avez pas encore de billets</h2>
          <p className="text-sm text-text-light mt-2 mb-8">Vos réservations apparaîtront ici une fois confirmées.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition"
          >
            RECHERCHER UN TRAJET
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket: any, i: number) => (
            <motion.div 
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass overflow-hidden rounded-[2.5rem] shadow-xl border border-white/50 flex flex-col md:flex-row"
            >
              {/* Info Section */}
              <div className="flex-1 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 bg-success/10 text-success text-[10px] font-black rounded-full uppercase tracking-widest">
                    {ticket.paymentStatus === 'paid' ? 'Payé' : 'Confirmé'}
                  </div>
                  <span className="text-[10px] font-bold text-text-muted">Réf: {ticket.id.slice(0, 8).toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-text-light uppercase mb-1">Trajet</p>
                    <p className="text-lg font-black text-dark leading-tight">
                      {ticket.departure.route.originCity} <br/>
                      <span className="text-primary">→</span> {ticket.departure.route.destinationCity}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-light uppercase mb-1">Agence</p>
                    <p className="text-lg font-black text-dark leading-tight">{ticket.departure.agency.name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                   <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-dark">{ticket.departure.date}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-dark">{ticket.departure.departureTime}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-dark text-white text-[10px] flex items-center justify-center font-black">
                         {ticket.seatNumber}
                      </div>
                      <span className="text-sm font-bold text-dark">Siège</span>
                   </div>
                </div>
              </div>

              {/* QR Section */}
              <div className="w-full md:w-64 bg-dark p-8 flex flex-col items-center justify-center relative">
                {/* Decorative cutouts for ticket look */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-surface -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-surface -translate-x-1/2 translate-y-1/2 rounded-full hidden md:block"></div>
                
                <div className="bg-white p-3 rounded-2xl mb-4 shadow-2xl">
                   <QRCodeSVG value={ticket.qrCode || ticket.id} size={140} />
                </div>
                <p className="text-white font-bold text-xs flex items-center gap-2">
                   <QrIcon className="w-4 h-4 text-accent" /> SCANNER À L'EMBARQUEMENT
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
