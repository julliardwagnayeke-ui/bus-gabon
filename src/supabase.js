import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant (cf .env).');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
