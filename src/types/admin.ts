// Admin types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'finance_admin' | 'support_admin' | 'operations_admin' | 'content_admin';
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalReservations: number;
  totalTicketsSold: number;
  grossRevenue: number;
  platformCommission: number;
  userFees: number;
  totalPlatformRevenue: number;
  netAgencyPayout: number;
  failedPayments: number;
  activeAgencies: number;
  departurestoday: number;
  supportTicketsOpen: number;
}

export interface AdminAlert {
  id: string;
  type: 'payment_pending' | 'agency_pending' | 'departure_cancelled' | 'support_urgent' | 'payment_failure' | 'agency_update';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolved: boolean;
}

export interface AdminActivityLog {
  id: string;
  admin: AdminUser;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  alerts: AdminAlert[];
  recentActivity: AdminActivityLog[];
  chartData: {
    salesByDay: Array<{ date: string; amount: number }>;
    revenueByWeek: Array<{ week: string; amount: number }>;
    ticketsByAgency: Array<{ agency: string; count: number }>;
    paymentSuccessRate: number;
    cancellationRate: number;
  };
}

export interface AgencyApprovalChecklist {
  officialNameConfirmed: boolean;
  phoneConfirmed: boolean;
  addressConfirmed: boolean;
  managerIdentified: boolean;
  atLeastOneBus: boolean;
  atLeastOneRoute: boolean;
  tariffsCommunicated: boolean;
  baggagePolicyProvided: boolean;
  cancellationPolicyProvided: boolean;
  partnershipAgrementSigned: boolean;
}

export interface AdminCommissionData {
  totalCommissions: number;
  totalUserFees: number;
  totalPlatformRevenue: number;
  commissionByAgency: Array<{
    agencyId: string;
    agencyName: string;
    commission: number;
  }>;
  commissionByPeriod: Array<{
    period: string;
    commission: number;
  }>;
  commissionByRoute: Array<{
    routeId: string;
    route: string;
    commission: number;
  }>;
}

export interface AdminPayoutData {
  agencyId: string;
  agencyName: string;
  period: string;
  grossSales: number;
  commission: number;
  netPayout: number;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'failed' | 'disputed' | 'cancelled';
  paymentDate?: string;
  paymentProof?: string;
  coordinationDetails?: string;
}

export interface SupportTicketAdmin {
  id: string;
  number: string;
  type: string;
  clientOrAgency: 'client' | 'agency';
  clientName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'waiting_agency' | 'resolved' | 'closed';
  assignedTo?: AdminUser;
  createdAt: string;
  updatedAt: string;
}
