'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchDeparture, createTicket } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import Spinner from '@/components/ui/Spinner';
import { motion } from 'framer-motion';
import { Bus, MapPin, Calendar, Clock, CreditCard, ChevronRight, ShieldCheck, Ticket } from 'lucide-react';
import { useState } from 'react';

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, authLoading } = useApp();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const { data: departure, isLoading } = useQuery({
    queryKey: ['departure', id],
    queryFn: () => fetchDeparture(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      router.push('/mes-billets');
    },
  });

  const handlePayment = () => {
    if (!selectedSeat) return;
    mutation.mutate({
      departureId: id as string,
      seatNumber: selectedSeat,
      price: departure.route.basePrice,
    });
  };

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

  if (!departure) return <div className="text-center py-20">Départ non trouvé.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-dark mb-8 tracking-tight">Finaliser votre réservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Journey Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-[2rem] shadow-xl border border-white/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-light uppercase tracking-wider">Récapitulatif du voyage</h2>
                <p className="text-lg font-bold text-dark">{departure.agency.name}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8 relative">
               <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs font-bold text-text-light uppercase">Départ</p>
                      <p className="text-lg font-extrabold text-dark">{departure.route.originCity}</p>
                      <p className="text-sm text-text-light flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {departure.date} à {departure.departureTime}
                      </p>
                    </div>
                  </div>
               </div>

               <div className="flex justify-center md:block">
                  <ChevronRight className="w-6 h-6 text-text-muted rotate-90 md:rotate-0" />
               </div>

               <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs font-bold text-text-light uppercase">Arrivée</p>
                      <p className="text-lg font-extrabold text-dark">{departure.route.destinationCity}</p>
                      <p className="text-sm text-text-light flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Environ {departure.arrivalTime || '6h'} de trajet
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Seat Selection (Simplified) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-border"
          >
            <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" /> Choisissez votre place
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {Array.from({ length: departure.bus.totalSeats }).map((_, i) => {
                const seatNum = i + 1;
                const isTaken = departure.tickets?.some((t: any) => t.seatNumber === seatNum && t.status === 'confirmed');
                return (
                  <button
                    key={seatNum}
                    disabled={isTaken}
                    onClick={() => setSelectedSeat(seatNum)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all
                      ${isTaken ? 'bg-surface-alt text-text-muted cursor-not-allowed opacity-40' : 
                        selectedSeat === seatNum ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 
                        'bg-surface-alt text-text hover:bg-primary/10 hover:border-primary/30 border border-transparent'}
                    `}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Summary & Payment */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark text-white p-8 rounded-[2.5rem] sticky top-24 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6">Paiement</h3>
            
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-sm">
                  <span className="text-white/60">Billet Adulte</span>
                  <span className="font-bold">{departure.route.basePrice.toLocaleString()} FCFA</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-white/60">Frais de service</span>
                  <span className="font-bold">500 FCFA</span>
               </div>
               <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-sm font-bold">TOTAL</span>
                  <span className="text-2xl font-black text-accent">{(departure.route.basePrice + 500).toLocaleString()} FCFA</span>
               </div>
            </div>

            <div className="space-y-3 mb-8">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Moyens de paiement</p>
               <div className="flex gap-2">
                  <div className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                     <span className="text-[8px] font-black">AIRTEL MONEY</span>
                  </div>
                  <div className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                     <span className="text-[8px] font-black">MOOV MONEY</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={!selectedSeat || mutation.isPending}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-14 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
            >
              {mutation.isPending ? <Spinner size="sm" light /> : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>PAYER MAINTENANT</span>
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-[10px] font-bold">
               <ShieldCheck className="w-3 h-3" /> PAIEMENT SÉCURISÉ SSL
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
