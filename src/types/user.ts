export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  address: string;
  isVerified: boolean;
  rating?: number;
}

export interface Departure {
  id: string;
  agency: Agency;
  originCity: string;
  destinationCity: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  availableSeats: number;
  baggageIncluded: number;
  routeId: string;
}

export interface Reservation {
  id: string;
  userId?: string;
  departureId: string;
  passengers: Passenger[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Passenger {
  id: string;
  name: string;
  phone?: string;
  document?: string;
}

export interface Ticket {
  id: string;
  reservationId: string;
  passengerName: string;
  departure: Departure;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled' | 'expired';
  createdAt: string;
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  method: 'airtel' | 'moov' | 'card';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}