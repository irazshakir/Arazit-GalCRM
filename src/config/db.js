import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure required environment variables are present
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Missing required Supabase environment variables');
    process.exit(1);
}

// Direct Postgres connection for webhooks and other direct DB operations
let sql;
try {
    if (process.env.DATABASE_URL) {
        sql = postgres(process.env.DATABASE_URL, {
            ssl: 'require',
            max: 10,
            idle_timeout: 20
        });
        console.log('Direct Postgres connection initialized');
    }
} catch (error) {
    console.error('Failed to initialize Postgres connection:', error);
}

// Supabase client for authentication and other Supabase features
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        db: {
            schema: 'public'
        },
        auth: {
            persistSession: true
        }
    }
);

export { sql, supabase };
