import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

// Direct Postgres connection
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10, // Max number of connections
  idle_timeout: 20 // Idle connection timeout in seconds
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export { sql, supabase };
