// Agency types
export interface Agency {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  mainCity: string;
  description?: string;
  operatingHours?: string;
  mainStation?: string;
  baggagePolicy?: string;
  cancellationPolicy?: string;
  verificationStatus: 'pending_review' | 'active' | 'suspended' | 'rejected';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Bus types
export interface Bus {
  id: string;
  agencyId: string;
  name: string;
  code: string;
  licensePlate: string;
  capacity: number;
  type: 'classique' | 'vip' | 'minibus' | 'climatise' | 'grand-bus';
  description?: string;
  equipment?: string[];
  photoUrl?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Route (Ligne) types
export interface Route {
  id: string;
  agencyId: string;
  fromCity: string;
  toCity: string;
  fromStation?: string;
  toStation?: string;
  basePrice: number;
  estimatedDuration: string;
  baggageIncluded: number;
  maxBaggageWeight?: number;
  extraBaggageFee?: number;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Departure types
export interface Departure {
  id: string;
  agencyId: string;
  routeId: string;
  busId: string;
  departureDate: string;
  departureTime: string;
  estimatedArrivalTime: string;
  ticketPrice: number;
  openSeats: number;
  soldSeats: number;
  baggageIncluded: number;
  maxBookingPerReservation: number;
  fromStation?: string;
  toStation?: string;
  specialConditions?: string;
  status: 'draft' | 'published' | 'closed' | 'boarding' | 'departed' | 'completed' | 'cancelled';
  cancellationReason?: string;
  delayMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  agencyId: string;
  departureId: string;
  code: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  passengers: BookingPassenger[];
  totalAmount: number;
  totalPaid: number;
  paymentStatus: 'pending_payment' | 'payment_processing' | 'paid' | 'payment_failed' | 'expired';
  reservationStatus: 'pending_payment' | 'confirmed' | 'cancelled' | 'checked_in' | 'completed';
  bookingDate: string;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPassenger {
  id: string;
  bookingId: string;
  name: string;
  phone?: string;
  document?: string;
  ticketCode: string;
  seatNumber?: string;
  baggageCount: number;
}

// Ticket types
export interface Ticket {
  id: string;
  code: string;
  bookingId: string;
  departureId: string;
  agencyId: string;
  passengerName: string;
  passengerPhone?: string;
  routeInfo: {
    fromCity: string;
    toCity: string;
    departureTime: string;
    departureDate: string;
  };
  qrCode: string;
  status: 'active' | 'used' | 'cancelled' | 'expired' | 'invalid';
  validationTime?: string;
  validatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Payout types
export interface Payout {
  id: string;
  agencyId: string;
  periodStart: string;
  periodEnd: string;
  grossSales: number;
  platformCommission: number;
  netAmount: number;
  payoutDate?: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'disputed';
  proof?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutSettings {
  id: string;
  agencyId: string;
  method: 'mobile_money' | 'bank_transfer' | 'check';
  holderName: string;
  mobileNumber?: string;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  financialResponsible: string;
  responsiblePhone: string;
  createdAt: string;
  updatedAt: string;
}

// Agency User types
export interface AgencyUser {
  id: string;
  agencyId: string;
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'owner' | 'manager' | 'checker' | 'finance';
  status: 'active' | 'suspended' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Support types
export interface SupportTicket {
  id: string;
  agencyId: string;
  code: string;
  type: 'payment_issue' | 'booking_issue' | 'ticket_issue' | 'agency_modification' | 'payout_request' | 'technical_issue' | 'other';
  subject: string;
  description: string;
  attachments?: string[];
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Sales Summary types
export interface SalesSummary {
  period: 'today' | 'week' | 'month';
  totalTickets: number;
  grossRevenue: number;
  platformCommission: number;
  netRevenue: number;
  userFees: number;
}

// Dashboard types
export interface DashboardStats {
  todaySales: SalesSummary;
  todayDepartures: number;
  activeDepartures: number;
  pendingBookings: number;
  validatedTickets: number;
  importantAlerts: string[];
}
