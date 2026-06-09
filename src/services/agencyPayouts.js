import { supabase } from '../supabase';
import { calcPricing, SERVICE_FEE } from '../lib/pricing';
import { logActivity } from './activityLogs';

// La table `payouts` stocke une seule chaîne `period` ; on encode/décode
// "début→fin" autour de ce séparateur.
const PERIOD_SEP = '→';

function mapPayout(row) {
  if (!row) return null;
  const [periodStart = '', periodEnd = ''] = (row.period || '').split(PERIOD_SEP);
  return {
    id: row.id,
    agencyId: row.agency_id,
    agencyName: row.agencies?.name || row.agency_id,
    periodStart,
    periodEnd,
    grossSalesAmount: row.gross_sales,
    commissionAmount: row.commission,
    agencyNetAmount: row.net_amount,
    status: row.status,
    notes: row.payment_reference,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

/**
 * Aperçu d'un versement pour une agence sur une période (réservations payées).
 * Les montants de prix ne sont pas stockés en base → recalculés via calcPricing.
 */
export async function calculatePayoutPreview(agencyId, fromDate, toDate) {
  const from = new Date(fromDate).toISOString();
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('reservations')
    .select('total_amount, paid_at, departures(ticket_price)')
    .eq('agency_id', agencyId)
    .eq('status', 'confirmed')
    .gte('paid_at', from)
    .lte('paid_at', to.toISOString());
  if (error) throw error;

  let reservationCount = 0, ticketCount = 0, grossSalesAmount = 0;
  let commissionAmount = 0, serviceFeeAmount = 0, agencyNetAmount = 0, platformRevenue = 0;

  for (const r of data) {
    const unitPrice = r.departures?.ticket_price ?? 0;
    const count = unitPrice > 0 ? Math.max(1, Math.round((r.total_amount - SERVICE_FEE) / unitPrice)) : 0;
    const p = calcPricing(unitPrice, count);
    reservationCount += 1;
    ticketCount      += count;
    grossSalesAmount += p.subtotal;
    commissionAmount += p.commission;
    serviceFeeAmount += p.serviceFee;
    agencyNetAmount  += p.agencyAmount;
    platformRevenue  += p.platformRevenue;
  }

  return { reservationCount, ticketCount, grossSalesAmount, commissionAmount, serviceFeeAmount, agencyNetAmount, platformRevenue };
}

export async function createPayout({ agencyId, agencyName, periodStart, periodEnd, grossSalesAmount, commissionAmount, agencyNetAmount }) {
  const { data, error } = await supabase
    .from('payouts')
    .insert({
      agency_id:  agencyId,
      period:     `${periodStart}${PERIOD_SEP}${periodEnd}`,
      gross_sales: grossSalesAmount || 0,
      commission:  commissionAmount || 0,
      net_amount:  agencyNetAmount || 0,
      status:      'pending',
    })
    .select('id')
    .single();
  if (error) throw error;

  logActivity({
    agencyId,
    action:     'agency.payout_created',
    entityType: 'payout',
    entityId:   data.id,
    metadata:   { agencyName, agencyNetAmount, periodStart, periodEnd },
  });

  return data.id;
}

export async function getPayouts(agencyId) {
  let q = supabase
    .from('payouts')
    .select('*, agencies(name)')
    .order('created_at', { ascending: false });
  if (agencyId) q = q.eq('agency_id', agencyId);

  const { data, error } = await q;
  if (error) return [];
  return data.map(mapPayout);
}

export async function markPayoutPaid(payoutId, notes = '') {
  const { error } = await supabase
    .from('payouts')
    .update({ status: 'paid', paid_at: new Date().toISOString(), payment_reference: notes })
    .eq('id', payoutId);
  if (error) throw error;

  logActivity({
    action:     'agency.payout_paid',
    entityType: 'payout',
    entityId:   payoutId,
    metadata:   { notes },
  });
}
