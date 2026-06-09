import { supabase } from '../supabase';

/**
 * Labels lisibles pour l'affichage dans le dashboard admin.
 */
export const ACTION_LABELS = {
  'reservation.created':  'Réservation créée',
  'payment.initiated':    'Paiement initié',
  'payment.confirmed':    'Paiement confirmé',
  'payment.failed':       'Paiement échoué',
  'ticket.validated':     'Billet validé',
  'agency.approved':      'Agence approuvée',
  'agency.suspended':     'Agence suspendue',
  'agency.updated':       'Agence modifiée',
};

export const ACTION_COLORS = {
  'reservation.created':  'blue',
  'payment.initiated':    'yellow',
  'payment.confirmed':    'green',
  'payment.failed':       'red',
  'ticket.validated':     'purple',
  'agency.approved':      'green',
  'agency.suspended':     'red',
  'agency.updated':       'gray',
};

// 'agency.payout_created' → module 'agency'. Sert à remplir la colonne `module`.
function moduleOf(action) {
  return (action || '').split('.')[0] || 'system';
}

function mapLog(row) {
  if (!row) return null;
  return {
    id: row.id,
    action: row.action,
    module: row.module,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata: row.new_value,   // metadata stockée dans new_value (jsonb)
    actorId: row.actor_id,
    createdAt: row.created_at,
  };
}

/**
 * Enregistre une action dans activity_logs.
 * Fire-and-forget : `actor_id` est NOT NULL → on n'écrit que si un user est connecté
 * (RLS : actor_id doit valoir auth.uid()). Les erreurs ne bloquent jamais le flux.
 */
export async function logActivity({ userId, agencyId, action, entityType, entityId, metadata } = {}) {
  (async () => {
    let actorId = userId;
    if (!actorId) {
      const { data } = await supabase.auth.getUser();
      actorId = data?.user?.id;
    }
    if (!actorId) return; // pas d'acteur → on ne journalise pas (contrainte NOT NULL)

    await supabase.from('activity_logs').insert({
      actor_id:    actorId,
      action,
      module:      moduleOf(action),
      entity_type: entityType || moduleOf(action),
      entity_id:   entityId || actorId,
      new_value:   metadata ? { ...metadata, agencyId: agencyId || null } : (agencyId ? { agencyId } : null),
    });
  })().catch(err => console.warn('[activityLogs] log failed:', action, err.message));
}

/**
 * Récupère les derniers logs pour le dashboard admin.
 * @param {{ limitCount?: number, entityType?: string, action?: string }} opts
 */
export async function getActivityLogs({ limitCount = 100, entityType, action } = {}) {
  let q = supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limitCount);
  if (entityType) q = q.eq('entity_type', entityType);
  if (action)     q = q.eq('action', action);

  const { data, error } = await q;
  if (error) return [];
  return data.map(mapLog);
}
