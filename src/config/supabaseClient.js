import { createClient } from '@supabase/supabase-js';

// Supabase client for frontend
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: true
    }
  }
);

export { supabase };
